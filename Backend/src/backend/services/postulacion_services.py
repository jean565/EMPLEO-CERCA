"""Postulaciones de usuarios autenticados."""
import pyodbc
from fastapi import HTTPException
from ..Schemas.postulacion import PostulacionCrear
from ..conexion import fila_diccionario, filas_diccionario, guardar_cambios
from .oferta_services import OfertaServicio


CONSULTA = '''SELECT id, oferta_id AS ofertaId, usuario_id AS usuarioId,
    nombre, correo, telefono, mensaje, CONVERT(NVARCHAR(40), fecha, 127) AS fecha FROM dbo.postulaciones'''


class PostulacionServicio:
    def guardar(self, conexion, datos: PostulacionCrear, usuario_id: int):
        OfertaServicio().obtener(conexion, datos.ofertaId)
        def operacion():
            cursor = conexion.cursor()
            cursor.execute('''INSERT INTO dbo.postulaciones
                (oferta_id, usuario_id, nombre, correo, telefono, mensaje)
                OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?)''',
                datos.ofertaId, usuario_id, datos.nombre.strip(),
                datos.correo.strip().lower(), datos.telefono.strip(), datos.mensaje.strip())
            return cursor.fetchone()[0]
        try:
            id_nuevo = guardar_cambios(conexion, operacion)
        except pyodbc.IntegrityError as error:
            if '2601' in str(error) or '2627' in str(error):
                raise HTTPException(status_code=409, detail='Ya registraste una postulación para esta oferta') from error
            raise
        cursor = conexion.cursor()
        cursor.execute(CONSULTA + ' WHERE id = ?', id_nuevo)
        return fila_diccionario(cursor)

    def mostrar(self, conexion):
        cursor = conexion.cursor()
        cursor.execute(CONSULTA + ' ORDER BY id DESC')
        return filas_diccionario(cursor)

    def mias(self, conexion, usuario_id: int):
        cursor = conexion.cursor()
        cursor.execute(CONSULTA + ' WHERE usuario_id = ? ORDER BY id DESC', usuario_id)
        return filas_diccionario(cursor)
