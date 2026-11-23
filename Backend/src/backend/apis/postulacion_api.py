from fastapi import APIRouter, Depends, status
from ..conexion import obtener_conexion
from ..Schemas.postulacion import Postulacion, PostulacionCrear
from ..services.postulacion_services import PostulacionServicio
from ..services.usuario_services import solo_admin, solo_postulante

router = APIRouter(prefix='/postulaciones', tags=['Postulaciones'])
servicio = PostulacionServicio()


@router.post('/', response_model=Postulacion, status_code=status.HTTP_201_CREATED)
def guardar(postulacionNueva: PostulacionCrear, conexion=Depends(obtener_conexion),
            usuario=Depends(solo_postulante)):
    return servicio.guardar(conexion, postulacionNueva, usuario['id'])


@router.get('/', response_model=list[Postulacion])
def mostrar(conexion=Depends(obtener_conexion), administrador=Depends(solo_admin)):
    return servicio.mostrar(conexion)


@router.get('/mias', response_model=list[Postulacion])
def mias(conexion=Depends(obtener_conexion), usuario=Depends(solo_postulante)):
    return servicio.mias(conexion, usuario['id'])
