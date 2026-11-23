# INSTRUCCIONES PARA OPENCODE: SOLO INTEGRACIÓN

## Objetivo
Conectar el frontend Angular existente con este backend FastAPI y la BD SQL Server `EmpleoCerca` ya creada. **No rediseñar páginas ni reescribir el backend**, salvo correcciones concretas imprescindibles tras probar la conexión SQL. Mantener los nombres y métodos que ya funcionan.

## Arquitectura obligatoria

Angular (localhost:4200) -> HTTP JSON -> FastAPI (localhost:8000) -> `conexion.py` + pyodbc -> SQL Server localhost / base `EmpleoCerca`.

La API ya usa consultas SQL Server y ya contiene lógica JWT/Argon2id. No usar SQLite, localStorage como BD, ORM, ni autenticación SQL Server con `sa`. `DB_SERVER`, `DB_NAME`, `DB_DRIVER`, `DB_TRUST_SERVER_CERTIFICATE` y `EMPLEO_JWT_SECRET` se leen del `.env` del backend; no compartir ese archivo en Git.

## Contrato exacto

- GET `/api/ofertas/` -> arreglo de `{id,titulo,empresa,ubicacion,modalidad,sueldo,categoria,descripcion,requisitos}`.
- GET `/api/ofertas/{id}` -> una oferta por ID.
- POST `/api/ofertas/` -> JSON de oferta, SIN `id`. Requiere administrador JWT.
- PUT `/api/ofertas/{id}` -> mismo JSON. Requiere administrador JWT.
- DELETE `/api/ofertas/{id}` -> desactiva la oferta. Requiere administrador JWT.
- POST `/api/usuarios/registro` -> `{nombre, contacto, nombre_usuario, contrasena}`. Crea postulante.
- POST `/api/usuarios/login` -> `{contacto, contrasena}` -> `{token,tipo,usuario}`.
- GET `/api/usuarios/yo` -> usuario actual. Requiere JWT.
- POST `/api/usuarios/logout` -> invalida token. Requiere JWT.
- POST `/api/postulaciones/` -> `{ofertaId, nombre, correo, telefono, mensaje}`. Requiere postulante JWT.
- GET `/api/postulaciones/mias` -> postulaciones propias; requiere postulante JWT.
- GET `/api/postulaciones/` -> listado general; requiere administrador JWT.

**Autorización:** `Authorization: Bearer <token>`. La API debe devolver 401 si falta sesión y 403 si el rol es incorrecto. No usar ni distribuir credenciales fijas de administración. Para crear un admin ejecutar `uv run python -m backend.crear_admin` desde la carpeta Backend.

## Integración Angular

1. Sustituir el servicio que lee y escribe ofertas en `localStorage` por solicitudes HTTP a FastAPI. Conservar métodos y tipos cuando sea posible, adaptando el uso asíncrono de `HttpClient`.
2. Registro y Login deben llamar a `/api/usuarios/registro` y `/api/usuarios/login`. No fingir que registrar crea una cuenta si la solicitud falla.
3. Al acceder a Ofertas sin login se muestra el listado público. Para postular se solicita login. Tras autenticarse se conserva el ID de oferta seleccionada y se regresa a esa postulación.
4. Si el usuario tiene rol `administrador`, mostrar Agregar/Editar/Eliminar, ocultar acciones de postular y comprobar permisos en backend. El backend también los verifica.
5. Al cerrar sesión llamar a `/api/usuarios/logout` con el token y borrar la sesión del frontend. Validar expiración / 401 y limpiar estado si deja de ser válida.
6. Los botones y SweetAlert2 deben reflejar respuesta real del servidor; mostrar error si POST/PUT/DELETE falla. Sin recargar para actualizar tarjetas.
7. Dejar de persistir usuarios, ofertas y postulaciones como fuente definitiva en localStorage. No copiar claves JWT ni contraseñas en código fuente. Evitar XSS; preferir binding Angular a HTML insertado.
8. Conservar la estructura visual actual, Bootstrap CDN, estilos responsive y rutas Angular. No modificar la BD con scripts que borren las tablas; están creadas.

## Verificación integral

- Iniciar backend y frontend en procesos separados.
- Crear cuenta postulante desde la web e iniciar sesión; comprobar en SQL Server que `clave_hash` inicia con `$argon2id$`.
- Como visitante consultar ofertas; al postular pedir login.
- Como administrador crear oferta desde Angular; debe aparecer en SQL Server y en tarjetas, también en otro navegador.
- Editar y eliminar oferta; comprobar que `activa=0` en SQL Server.
- Postular con postulante; impedir duplicados y rechazar administrador (403).
- Logout: la API debe rechazar ese JWT luego de cerrar sesión.
- Realizar pruebas reales desde Swagger y el navegador, documentar los resultados y realizar commits descriptivos / Pull Requests del equipo.

**Nota:** Este backend ya está convertido a pyodbc. OpenCode NO debe volver a migrar SQLite. Si detecta errores de conexión, mostrar el error concreto y corregir solo lo necesario, conservando las interfaces.
