from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .apis.oferta_api import router as oferta_router
from .apis.usuario_api import router as usuario_router
from .apis.postulacion_api import router as postulacion_router

app = FastAPI(title='Empleo Cerca API', version='1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:4200', 'http://127.0.0.1:4200'],
    allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
    allow_headers=['Authorization', 'Content-Type'],
)

app.include_router(oferta_router, prefix='/api')
app.include_router(usuario_router, prefix='/api')
app.include_router(postulacion_router, prefix='/api')


@app.get('/')
def inicio_api():
    return {'mensaje': 'API de Empleo Cerca en funcionamiento'}
