from pydantic import BaseModel, Field


class PostulacionCrear(BaseModel):
    ofertaId: int = Field(gt=0)
    nombre: str = Field(min_length=3, max_length=100)
    correo: str = Field(min_length=5, max_length=120, pattern=r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    telefono: str = Field(min_length=9, max_length=15, pattern=r'^\+?[0-9]{9,15}$')
    mensaje: str = Field(default='', max_length=1500)


class Postulacion(PostulacionCrear):
    id: int
    usuarioId: int
    fecha: str
