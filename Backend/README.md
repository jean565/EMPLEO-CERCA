# Empleo Cerca — Backend FastAPI y SQL Server

Backend organizado de forma parecida al CRUD de **Estudiante** desarrollado en clase. Se conservan las carpetas `apis`, `Schemas` y `services`, y se agrega `conexion.py` para trabajar con SQL Server mediante `pyodbc`, **sin ORM**.

## 1. Archivos y por qué están aquí

```text
Backend/
├── src/
│   └── backend/
│       ├── __init__.py                 # Archivo del paquete creado por uv: CONSERVAR
│       ├── main.py                     # Inicializa FastAPI e incluye las rutas
│       ├── conexion.py                 # Se conecta a SQL Server con pyodbc
│       ├── crear_admin.py              # Crea la primera cuenta administradora
│       ├── apis/                       # Rutas /api/ofertas, /api/usuarios, /api/postulaciones
│       ├── Schemas/                    # Validaciones con Pydantic
│       └── services/                   # Operaciones y consultas SQL con parámetros ?
├── 01_crear_base_datos.sql             # Script reproducible de las tablas (no repetir si ya existen)
├── 02_verificar_bd.sql                 # Consultas para verificar tablas y relaciones
├── .env.example                       # Ejemplo de variables, sin secretos
├── .gitignore                         # Evita publicar .env y archivos locales
├── pyproject.toml                     # Dependencias manejadas con uv
├── README.md                          # Esta guía
└── OPENCODE_SOLO_INTEGRACION.md        # Contrato para unir Angular y FastAPI
```

**Conserva los archivos que `uv` haya generado en tu proyecto original**, por ejemplo `.python-version`, `uv.lock`, `src/backend/__init__.py` y tu entorno `.venv`. Este ZIP contiene **solo código y archivos que deben añadirse o actualizarse**: no se debe borrar la carpeta original ni copiar encima un proyecto vacío. `uv.lock` se conserva en tu equipo y `uv sync` lo actualiza cuando cambien las dependencias.

No se incluyen `repositories/` (el acceso SQL ya está en `services`), SQLite (`*.db`), datos ficticios precargados, pruebas simuladas ni guías duplicadas. Para explicar las capas se puede revisar este mismo README.

## 2. Base de datos SQL Server

La base definitiva es `EmpleoCerca`, creada en SSMS con seis tablas: `usuarios`, `empresas`, `categorias`, `ofertas`, `postulaciones` y `sesiones`.

- `empresas` y `categorias` se guardan por separado; cada oferta almacena sus identificadores, no sus nombres repetidos.
- `postulaciones` relaciona `oferta_id` con `usuario_id`; registra los datos de contacto proporcionados al postular.
- `sesiones` conserva la **huella SHA-256 del JWT** para permitir revocarlo al cerrar sesión, no el token original.
- El diseño está orientado a 3FN: atributos atómicos (1FN); cada tabla usa una clave primaria simple y sus campos dependen de ella (2FN); y se evitan dependencias transitivas mediante las tablas de empresas y categorías (3FN).

**No ejecutes** `01_crear_base_datos.sql` para reemplazar o borrar tablas que ya existen. El backend no crea automáticamente las tablas; solo realiza operaciones sobre ellas.

## 3. Configuración con uv (Windows)

Dentro de tu **Backend** existente:

```powershell
uv sync
```

Crea `Backend/.env` usando `.env.example` como referencia:

```dotenv
DB_SERVER=localhost
DB_NAME=EmpleoCerca
DB_DRIVER=ODBC Driver 18 for SQL Server
DB_TRUST_SERVER_CERTIFICATE=yes
EMPLEO_JWT_SECRET=COLOCA_UN_SECRETO_ALEATORIO_LARGO_AQUI
```

Para generar un secreto JWT personal (no copiar el ejemplo como contraseña):

```powershell
uv run python -c "import secrets; print(secrets.token_urlsafe(48))"
```

El programa utiliza **Autenticación de Windows** (`Trusted_Connection=yes`). No se usa `sa`, ni contraseñas de SQL Server en el código. La confianza explícita en el certificado es únicamente para el desarrollo local; en producción se debe verificar el certificado del servidor.

Inicia el backend:

```powershell
uv run uvicorn backend.main:app --reload --port 8000
```

Abre: `http://127.0.0.1:8000/docs`.

## 4. Crear el administrador

Ejecuta **una vez**:

```powershell
uv run python -m backend.crear_admin
```

Introduce nombre, correo, usuario y contraseña. La contraseña no se guarda en claro: se almacena con **Argon2id** (`argon2-cffi`). El público solo puede registrarse como `postulante`; la cuenta administradora se crea desde este comando.

## 5. Rutas principales

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/api/ofertas/` | Público |
| GET | `/api/ofertas/{id}` | Público |
| POST | `/api/ofertas/` | Administrador |
| PUT | `/api/ofertas/{id}` | Administrador |
| DELETE | `/api/ofertas/{id}` | Administrador; desactiva la oferta |
| POST | `/api/usuarios/registro` | Público; registra postulante |
| POST | `/api/usuarios/login` | Público; entrega JWT |
| GET | `/api/usuarios/yo` | Usuario autenticado |
| POST | `/api/usuarios/logout` | Usuario autenticado |
| POST | `/api/postulaciones/` | Postulante autenticado |
| GET | `/api/postulaciones/mias` | Postulante autenticado |
| GET | `/api/postulaciones/` | Administrador |

El JWT se transmite como `Authorization: Bearer <token>`, vence a las 8 horas y se comprueba en el servidor. El administrador **no puede postular**, y un visitante debe iniciar sesión para hacerlo. Las consultas se parametrizan con `?` de `pyodbc`.

## 6. Comprobaciones antes de la integración

Desde Swagger (`/docs`), probar al menos: registro, login, GET de ofertas, crear/editar/eliminar como administrador, postular con cuenta postulante, intento de postulación como administrador (debe rechazar), logout y rechazo del token cerrado. Comprobar en SSMS que los registros llegan a **SQL Server**. Estas pruebas manuales son necesarias porque este ZIP no contiene una base SQL Server real ni pruebas automatizadas conectadas a tu máquina.

El archivo `OPENCODE_SOLO_INTEGRACION.md` se reserva para la etapa final de vinculación con Angular. OpenCode **no debe rehacer el backend**, solo conectar las solicitudes HTTP y ajustar fallos concretos demostrados.

## 7. Importante para Git

No subir `.env`, `.venv`, `.jwt_secret` ni datos locales. Sí se puede subir `.env.example` (sin secretos), los scripts SQL y el código fuente. Hacer commits descriptivos y Pull Requests según la rúbrica.
