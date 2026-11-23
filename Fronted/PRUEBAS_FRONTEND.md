# Guía local de pruebas — Empleo Cerca

Esta guía sirve para comprobar la integración entre el frontend Angular (`Fronted`)
y el backend FastAPI (`Backend`) con SQL Server.

## 1. Preparar el entorno

Desde la carpeta `Backend`, con SQL Server en ejecución y la base `EmpleoCerca` creada:

```powershell
uv run python -m backend.crear_admin
```

Ese comando crea el usuario administrador inicial. Después inicia la API:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000
```

Desde la carpeta `Fronted` inicia el frontend:

```powershell
npm install
npm start
```

Abrir `http://localhost:4200`. La API debe estar en `http://127.0.0.1:8000`.

## 2. Pruebas como visitante (sin iniciar sesión)

1. `/ofertas` lista las ofertas activas y cada tarjeta muestra «Ver detalles».
2. El buscador y el filtro por categoría funcionan sobre los datos de la API.
3. `/detalle-oferta/:id` muestra la información completa de la oferta.
4. Al pulsar «Postular ahora» se redirige a `/login` con `returnUrl`; tras
   iniciar sesión como postulante se vuelve automáticamente a `/postular/:id`.
5. Un ID inexistente o una oferta desactivada muestran «Oferta no encontrada» (404).

## 3. Pruebas como postulante

1. `/registro` crea una cuenta real (se guarda con Argon2id en SQL Server).
2. `/login` inicia sesión y guarda el JWT en `sessionStorage`.
3. Recargar la página conserva la sesión: el usuario se recupera con `GET /api/usuarios/yo`.
4. Enviar el formulario de postulación guarda la postulación y evita duplicados (409).
5. «Cerrar sesión» revoca el token en el servidor y limpia la sesión local.
6. Tras cerrar sesión, `/postular/:id` vuelve a pedir inicio de sesión.

## 4. Pruebas como administrador

1. Iniciar sesión con el administrador creado por `backend.crear_admin`.
2. `/ofertas` muestra la barra de administración con «Agregar oferta»,
   «Ver postulaciones» y «Cerrar sesión».
3. Cada tarjeta muestra «Editar» y «Eliminar» en lugar de «Ver detalles».
4. Crear, editar y eliminar ofertas actualiza la API y el listado.
5. «Ver postulaciones» carga las postulaciones recibidas.
6. El administrador no puede postular: `/postular/:id` redirige a `/ofertas`
   y la API responde `403` si se intenta igualmente.

## 5. Comprobaciones automáticas

```powershell
# Frontend
cd Fronted
npm run build
npm test -- --watch=false

# Backend (desde la raíz del repositorio y con la API en ejecución)
# La verificación integral cubre registro, login, roles, CRUD y postulaciones.
```

## Notas

- No hay usuarios ni contraseñas de demostración en el código del frontend.
- Las credenciales viven en SQL Server y las contraseñas se almacenan con Argon2id.
- El JWT se guarda solo en `sessionStorage`; el usuario y el rol se mantienen en
  memoria (signals) y se restauran consultando la API.
