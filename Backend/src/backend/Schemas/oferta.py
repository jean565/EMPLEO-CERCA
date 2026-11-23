from pydantic import BaseModel, Field, field_validator


class OfertaCrear(BaseModel):
    titulo: str = Field(min_length=3, max_length=100)
    empresa: str = Field(min_length=2, max_length=100)
    ubicacion: str = Field(min_length=2, max_length=100)
    modalidad: str = Field(min_length=3, max_length=50)
    sueldo: str = Field(min_length=2, max_length=60)
    categoria: str = Field(min_length=2, max_length=60)
    descripcion: str = Field(min_length=10, max_length=2000)
    requisitos: str = Field(min_length=10, max_length=2000)

    @field_validator('titulo', 'empresa', 'ubicacion', 'modalidad', 'sueldo', 'categoria', 'descripcion', 'requisitos')
    @classmethod
    def sin_espacios_vacios(cls, valor: str) -> str:
        if not valor.strip():
            raise ValueError('El campo no puede estar vacío')
        return valor.strip()


class OfertaActualizar(OfertaCrear):
    pass


class Oferta(OfertaCrear):
    id: int
