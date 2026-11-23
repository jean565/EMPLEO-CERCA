from getpass import getpass
from pydantic import ValidationError
from .conexion import conectar
from .Schemas.usuario import UsuarioRegistro
from .services.usuario_services import UsuarioServicio


def main():
    print('Crear administrador de Empleo Cerca')
    nombre = input('Nombre: ').strip()
    contacto = input('Correo electrónico: ').strip()
    nombre_usuario = input('Nombre de usuario: ').strip()
    contrasena = getpass('Contraseña (mínimo 8 caracteres): ')
    try:
        datos = UsuarioRegistro(nombre=nombre, contacto=contacto,
                                nombre_usuario=nombre_usuario, contrasena=contrasena)
        conexion = conectar()
        try:
            usuario = UsuarioServicio().registrar(conexion, datos, rol='administrador')
        finally:
            conexion.close()
        print('Administrador creado:', usuario['contacto'])
    except ValidationError as error:
        print('Revisa los datos:', error)


if __name__ == '__main__':
    main()
