"""CRUD de ofertas; consultas parametrizadas sin ORM."""
from fastapi import HTTPException
from ..Schemas.oferta import OfertaCrear
from ..conexion import fila_diccionario, filas_diccionario, guardar_cambios


CONSULTA = '''SELECT o.id, o.titulo, e.nombre AS empresa, o.ubicacion,
    o.modalidad, o.sueldo, c.nombre AS categoria, o.descripcion, o.requisitos
    FROM dbo.ofertas o
    JOIN dbo.empresas e ON e.id = o.empresa_id
    JOIN dbo.categorias c ON c.id = o.categoria_id
    WHERE o.activa = 1'''


def obtener_o_crear(cursor, tabla: str, nombre: str):
    if tabla not in ('empresas', 'categorias'):
        raise ValueError('Tabla no permitida')
    cursor.execute(f'SELECT id FROM dbo.{tabla} WHERE nombre = ?', nombre)
    fila = cursor.fetchone()
    if fila:
        return fila[0]
    cursor.execute(f'INSERT INTO dbo.{tabla} (nombre) OUTPUT INSERTED.id VALUES (?)', nombre)
    return cursor.fetchone()[0]


class OfertaServicio:
    def mostrar(self, conexion):
        cursor = conexion.cursor()
        cursor.execute(CONSULTA + ' ORDER BY o.id DESC')
        return filas_diccionario(cursor)

    def obtener(self, conexion, id: int):
        cursor = conexion.cursor()
        cursor.execute(CONSULTA + ' AND o.id = ?', id)
        oferta = fila_diccionario(cursor)
        if oferta is None:
            raise HTTPException(status_code=404, detail='Oferta no encontrada')
        return oferta

    def guardar(self, conexion, ofertaNueva: OfertaCrear):
        def operacion():
            cursor = conexion.cursor()
            empresa_id = obtener_o_crear(cursor, 'empresas', ofertaNueva.empresa)
            categoria_id = obtener_o_crear(cursor, 'categorias', ofertaNueva.categoria)
            cursor.execute('''INSERT INTO dbo.ofertas
                (titulo, empresa_id, ubicacion, modalidad, sueldo, categoria_id, descripcion, requisitos)
                OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                ofertaNueva.titulo, empresa_id, ofertaNueva.ubicacion, ofertaNueva.modalidad,
                ofertaNueva.sueldo, categoria_id, ofertaNueva.descripcion, ofertaNueva.requisitos)
            return cursor.fetchone()[0]
        nuevo_id = guardar_cambios(conexion, operacion)
        return self.obtener(conexion, nuevo_id)

    def actualizar(self, conexion, id: int, oferta: OfertaCrear):
        self.obtener(conexion, id)
        def operacion():
            cursor = conexion.cursor()
            empresa_id = obtener_o_crear(cursor, 'empresas', oferta.empresa)
            categoria_id = obtener_o_crear(cursor, 'categorias', oferta.categoria)
            cursor.execute('''UPDATE dbo.ofertas SET titulo=?, empresa_id=?, ubicacion=?,
                modalidad=?, sueldo=?, categoria_id=?, descripcion=?, requisitos=?
                WHERE id=? AND activa=1''', oferta.titulo, empresa_id, oferta.ubicacion,
                oferta.modalidad, oferta.sueldo, categoria_id, oferta.descripcion, oferta.requisitos, id)
        guardar_cambios(conexion, operacion)
        return self.obtener(conexion, id)

    def eliminar(self, conexion, id: int):
        def operacion():
            cursor = conexion.cursor()
            cursor.execute('UPDATE dbo.ofertas SET activa=0 WHERE id=? AND activa=1', id)
            return cursor.rowcount
        if guardar_cambios(conexion, operacion) == 0:
            raise HTTPException(status_code=404, detail='Oferta no encontrada')
        return {'mensaje': 'Oferta eliminada'}
