from fastapi import APIRouter, Depends, status
from ..conexion import obtener_conexion
from ..Schemas.oferta import Oferta, OfertaCrear, OfertaActualizar
from ..services.oferta_services import OfertaServicio
from ..services.usuario_services import solo_admin

router = APIRouter(prefix='/ofertas', tags=['Ofertas'])
servicio = OfertaServicio()


@router.get('/', response_model=list[Oferta])
def mostrar(conexion=Depends(obtener_conexion)):
    return servicio.mostrar(conexion)


@router.get('/{id}', response_model=Oferta)
def obtener(id: int, conexion=Depends(obtener_conexion)):
    return servicio.obtener(conexion, id)


@router.post('/', response_model=Oferta, status_code=status.HTTP_201_CREATED)
def guardar(ofertaNueva: OfertaCrear, conexion=Depends(obtener_conexion),
            administrador=Depends(solo_admin)):
    return servicio.guardar(conexion, ofertaNueva)


@router.put('/{id}', response_model=Oferta)
def actualizar(id: int, oferta: OfertaActualizar, conexion=Depends(obtener_conexion),
               administrador=Depends(solo_admin)):
    return servicio.actualizar(conexion, id, oferta)


@router.delete('/{id}')
def eliminar(id: int, conexion=Depends(obtener_conexion),
             administrador=Depends(solo_admin)):
    return servicio.eliminar(conexion, id)
