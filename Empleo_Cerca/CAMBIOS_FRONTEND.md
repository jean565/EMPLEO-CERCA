# Empleo Cerca - Ajustes del frontend

## Funciones por rol

- **Visitante o postulante**: puede ver detalles de cada oferta y utilizar el formulario Postular.
- **Administrador de demostración**: puede agregar, editar, eliminar ofertas y consultar postulaciones desde `/ofertas`. Ya no ve botones «Ver detalles» en Inicio ni en Ofertas, ni el botón «Postular ahora» al abrir directamente un detalle.
- El acceso directo a `/postular/:id` está bloqueado en el **cliente** para la sesión de administrador (redirecciona a Ofertas). El formulario también comprueba el rol antes de guardar, como protección adicional de demostración.

## Inicio de sesión

- No se muestran usuario ni contraseña de prueba en la página Login.
- Para comprobar el modo administrador en el proyecto local, usar las credenciales **de demostración** que están en `PRUEBAS_FRONTEND.md`. **No son seguras ni sirven para producción**.

## Límites importantes para la rúbrica

- El administrador **no está protegido de forma segura**: tanto la comprobación de credenciales como el rol de sesión están implementados únicamente en Angular y pueden manipularse desde el navegador.
- Cuando se implemente FastAPI, las credenciales deberán verificarse en el servidor (contraseñas almacenadas con hash), y el backend deberá comprobar los permisos antes de **crear, editar o eliminar ofertas, o registrar postulaciones**. Ocultar botones por sí solo no aporta seguridad.
- Las ofertas y postulaciones se almacenan en `localStorage` como prueba. La base de datos y la autenticación segura quedan pendientes.

## Conservado

- Diseño, CRUD de demostración, filtros, navegación, registro con los cuatro campos solicitados y scroll al inicio de cada página.

## Ejecución

Abrir `Empleo_Cerca` en VS Code y ejecutar `npm install` y `ng serve`.
