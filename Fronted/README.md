# EmpleoCerca

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.7.

## Empleo Cerca

Frontend Angular integrado con la API FastAPI del repositorio (`../Backend`) y
SQL Server. El diseño y las rutas se conservan; los datos y la autenticación ya
no son de demostración.

### Requisitos para ejecutar

1. SQL Server en ejecución y la base `EmpleoCerca` creada.
2. API en `http://127.0.0.1:8000`:

   ```powershell
   cd ../Backend
   uv run python -m backend.crear_admin
   .\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000
   ```

3. Frontend:

   ```powershell
   npm install
   npm start
   ```

Abrir `http://localhost:4200`. Consulta `PRUEBAS_FRONTEND.md` para las pruebas
por rol y `CAMBIOS_FRONTEND.md` para el detalle de la integración.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
