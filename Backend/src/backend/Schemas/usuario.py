import re
from pydantic import BaseModel, Field, field_validator


class UsuarioRegistro(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    contacto: str = Field(min_length=9, max_length=120)
    nombre_usuario: str = Field(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    contrasena: str = Field(min_length=8, max_length=128)

    @field_validator('contacto')
    @classmethod
    def validar_contacto(cls, valor: str) -> str:
        dato = valor.strip().lower()
        correo = re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', dato)
        celular = re.fullmatch(r'9\d{8}', dato)
        if not correo and not celular:
            raise ValueError('Ingresa un correo o celular peruano válido')
        return dato

    @field_validator('nombre')
    @classmethod
    def validar_nombre(cls, valor: str) -> str:
        nombre = valor.strip()
        if len(nombre) < 3:
            raise ValueError('El nombre debe tener al menos 3 caracteres')
        return nombre


class UsuarioAcceso(BaseModel):
    contacto: str
    contrasena: str


class Usuario(BaseModel):
    id: int
    nombre: str
    contacto: str
    nombre_usuario: str
    rol: str


class Sesion(BaseModel):
    token: str
    tipo: str = 'bearer'
    usuario: Usuario
