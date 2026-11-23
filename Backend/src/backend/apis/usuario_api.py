from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from ..conexion import obtener_conexion
from ..Schemas.usuario import UsuarioRegistro, UsuarioAcceso, Usuario, Sesion
from ..services.usuario_services import (
    UsuarioServicio, usuario_actual, seguridad, cerrar_sesion
)

router = APIRouter(prefix='/usuarios', tags=['Usuarios'])
servicio = UsuarioServicio()


@router.post('/registro', response_model=Usuario, status_code=status.HTTP_201_CREATED)
def registrar(datos: UsuarioRegistro, conexion=Depends(obtener_conexion)):
    return servicio.registrar(conexion, datos)


@router.post('/login', response_model=Sesion)
def login(datos: UsuarioAcceso, conexion=Depends(obtener_conexion)):
    return servicio.iniciar_sesion(conexion, datos)


@router.get('/yo', response_model=Usuario)
def yo(usuario=Depends(usuario_actual)):
    return usuario


@router.post('/logout')
def salir(credenciales: HTTPAuthorizationCredentials = Depends(seguridad),
          usuario=Depends(usuario_actual), conexion=Depends(obtener_conexion)):
    cerrar_sesion(conexion, credenciales.credentials)
    return {'mensaje': 'Sesión cerrada'}
