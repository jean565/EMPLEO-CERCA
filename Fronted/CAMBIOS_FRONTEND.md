# Empleo Cerca - Ajustes del frontend

## Integración con FastAPI

El frontend Angular ya consume la API real del backend (`Backend/`) en lugar de
usar datos de demostración.

- `Services/api.ts`: URL base de la API (`http://127.0.0.1:8000/api`).
- `Services/usuario.ts`: registro, login, logout y recuperación del usuario actual.
- `Services/oferta.ts`: listado público y CRUD de ofertas.
- `Services/postulacion.ts`: registro y consulta de postulaciones.
- `Services/sesion-store.ts`: guarda únicamente el JWT en `sessionStorage` y
  mantiene el usuario y el rol en memoria con signals.
- `Services/auth.interceptor.ts`: añade `Authorization: Bearer` y limpia la sesión
  ante un `401`.
- `guards/auth.guard.ts`: protege `/postular/:id` para postulantes autenticados.

## Funciones por rol

- **Visitante**: consulta ofertas y detalles sin iniciar sesión.
- **Postulante autenticado**: además puede enviar postulaciones. Si intenta postular
  sin sesión, se le redirige a `/login` y vuelve al formulario tras autenticarse.
- **Administrador**: crea, edita y elimina ofertas y consulta las postulaciones
  recibidas desde `/ofertas`. No ve «Ver detalles» ni «Postular ahora» y la API
  rechaza sus intentos de postular con `403`.

## Seguridad

- Las contraseñas se verifican en el servidor y se almacenan con **Argon2id**.
- La autenticación usa **JWT**; el logout revoca el token en la tabla de sesiones.
- El backend comprueba el rol en cada operación protegida. Ocultar botones en el
  cliente es solo una ayuda visual, no la protección real.
- Los secretos (`Backend/.env`) no se muestran ni se versionan.

## Conservado

- Diseño, estilos, Bootstrap por CDN, rutas y estructura visual originales.
- Filtros, buscador, scroll al inicio y alertas con SweetAlert2.

## Ejecución

1. Backend: `uv run python -m backend.crear_admin` y luego
   `.\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000`.
2. Frontend: `npm install` y `npm start`, abrir `http://localhost:4200`.

Ver `PRUEBAS_FRONTEND.md` para el detalle de las pruebas.
