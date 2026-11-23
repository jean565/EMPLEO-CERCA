"""Conexión a SQL Server con ODBC y autenticación de Windows."""
import os
from pathlib import Path

import pyodbc
from dotenv import load_dotenv

RAIZ = Path(__file__).resolve().parents[2]
load_dotenv(RAIZ / '.env')


def conectar():
    servidor = os.getenv('DB_SERVER')
    base = os.getenv('DB_NAME')
    controlador = os.getenv('DB_DRIVER', 'ODBC Driver 18 for SQL Server')
    if not servidor or not base:
        raise RuntimeError('Configura DB_SERVER y DB_NAME en el archivo .env')
    if controlador not in pyodbc.drivers():
        raise RuntimeError(f'No se encontró el controlador ODBC: {controlador}')
    cadena = (
        f'DRIVER={{{controlador}}};'
        f'SERVER={servidor};'
        f'DATABASE={base};'
        'Trusted_Connection=yes;'
        'Encrypt=yes;'
        f'TrustServerCertificate={os.getenv("DB_TRUST_SERVER_CERTIFICATE", "yes")};'
    )
    return pyodbc.connect(cadena, timeout=5, autocommit=False)


def obtener_conexion():
    conexion = conectar()
    try:
        yield conexion
    finally:
        conexion.close()


def fila_diccionario(cursor):
    fila = cursor.fetchone()
    if fila is None:
        return None
    columnas = [columna[0] for columna in cursor.description]
    return dict(zip(columnas, fila))


def filas_diccionario(cursor):
    columnas = [columna[0] for columna in cursor.description]
    return [dict(zip(columnas, fila)) for fila in cursor.fetchall()]


def guardar_cambios(conexion, operacion):
    """Confirma todas las consultas de una operación, o las revierte si falla."""
    try:
        resultado = operacion()
        conexion.commit()
        return resultado
    except Exception:
        conexion.rollback()
        raise
