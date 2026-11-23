"""Autenticación JWT y contraseñas con Argon2id (argon2-cffi)."""
import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
import pyodbc
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..conexion import obtener_conexion, fila_diccionario, guardar_cambios
from ..Schemas.usuario import UsuarioRegistro, UsuarioAcceso

hasher = PasswordHasher()
seguridad = HTTPBearer(auto_error=False)


def clave_jwt():
    clave = os.getenv('EMPLEO_JWT_SECRET', '')
    if len(clave) < 32:
        raise RuntimeError('Configura EMPLEO_JWT_SECRET (32 caracteres como mínimo) en .env')
    return clave


def encriptar_clave(contrasena: str):
    return hasher.hash(contrasena)


def comprobar_clave(contrasena: str, almacenada: str):
    try:
        return hasher.verify(almacenada, contrasena)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def usuario_publico(usuario):
    return {campo: usuario[campo] for campo in ('id', 'nombre', 'contacto', 'nombre_usuario', 'rol')}


def obtener_por_contacto(conexion, contacto):
    cursor = conexion.cursor()
    cursor.execute('SELECT * FROM dbo.usuarios WHERE contacto=?', contacto)
    return fila_diccionario(cursor)


def obtener_por_id(conexion, id):
    cursor = conexion.cursor()
    cursor.execute('SELECT * FROM dbo.usuarios WHERE id=?', id)
    return fila_diccionario(cursor)


class UsuarioServicio:
    def registrar(self, conexion, datos: UsuarioRegistro, rol='postulante'):
        if rol not in ('postulante', 'administrador'):
            raise ValueError('Rol no permitido')

        def operacion():
            cursor = conexion.cursor()
            cursor.execute('''INSERT INTO dbo.usuarios
                (nombre, nombre_usuario, contacto, clave_hash, rol)
                OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?)''',
                datos.nombre, datos.nombre_usuario, datos.contacto,
                encriptar_clave(datos.contrasena), rol)
            return cursor.fetchone()[0]

        try:
            id_nuevo = guardar_cambios(conexion, operacion)
        except pyodbc.IntegrityError as error:
            if '2601' in str(error) or '2627' in str(error):
                raise HTTPException(status_code=409, detail='El contacto o nombre de usuario ya existe') from error
            raise
        return usuario_publico(obtener_por_id(conexion, id_nuevo))

    def iniciar_sesion(self, conexion, datos: UsuarioAcceso):
        usuario = obtener_por_contacto(conexion, datos.contacto.strip().lower())
        if usuario is None or not comprobar_clave(datos.contrasena, usuario['clave_hash']):
            raise HTTPException(status_code=401, detail='Correo, celular o contraseña incorrectos')
        if hasher.check_needs_rehash(usuario['clave_hash']):
            def actualizar():
                conexion.cursor().execute('UPDATE dbo.usuarios SET clave_hash=? WHERE id=?',
                                         encriptar_clave(datos.contrasena), usuario['id'])
            guardar_cambios(conexion, actualizar)

        ahora = datetime.now(timezone.utc)
        expiracion = ahora + timedelta(hours=8)
        token = jwt.encode({
            'sub': str(usuario['id']), 'rol': usuario['rol'], 'iat': ahora,
            'exp': expiracion, 'jti': secrets.token_hex(16), 'tipo': 'acceso',
        }, clave_jwt(), algorithm='HS256')
        huella = hashlib.sha256(token.encode()).hexdigest()

        def guardar_sesion():
            conexion.cursor().execute('''INSERT INTO dbo.sesiones
                (usuario_id, token_hash, expira_en) VALUES (?, ?, ?)''',
                usuario['id'], huella, expiracion.isoformat())
        guardar_cambios(conexion, guardar_sesion)
        return {'token': token, 'tipo': 'bearer', 'usuario': usuario_publico(usuario)}


def usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(seguridad),
    conexion=Depends(obtener_conexion),
):
    if credenciales is None or credenciales.scheme.lower() != 'bearer':
        raise HTTPException(status_code=401, detail='Debes iniciar sesión')
    token = credenciales.credentials
    try:
        datos = jwt.decode(token, clave_jwt(), algorithms=['HS256'],
                           options={'require': ['sub', 'exp', 'iat', 'jti']})
        if datos.get('tipo') != 'acceso' or not isinstance(datos.get('sub'), str):
            raise jwt.InvalidTokenError('Token inválido')
        id_usuario = int(datos['sub'])
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail='Sesión inválida o vencida')

    huella = hashlib.sha256(token.encode()).hexdigest()
    cursor = conexion.cursor()
    cursor.execute('''SELECT u.* FROM dbo.sesiones s
        JOIN dbo.usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_en > SYSUTCDATETIME()''', huella)
    usuario = fila_diccionario(cursor)
    if usuario is None or usuario['id'] != id_usuario:
        raise HTTPException(status_code=401, detail='Sesión inválida o cerrada')
    return usuario_publico(usuario)


def cerrar_sesion(conexion, token):
    huella = hashlib.sha256(token.encode()).hexdigest()
    def operacion():
        conexion.cursor().execute('DELETE FROM dbo.sesiones WHERE token_hash=?', huella)
    guardar_cambios(conexion, operacion)


def solo_admin(usuario=Depends(usuario_actual)):
    if usuario['rol'] != 'administrador':
        raise HTTPException(status_code=403, detail='Solo el administrador puede realizar esta acción')
    return usuario


def solo_postulante(usuario=Depends(usuario_actual)):
    if usuario['rol'] != 'postulante':
        raise HTTPException(status_code=403, detail='El administrador no puede postular')
    return usuario
