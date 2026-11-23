# Guía local de pruebas — Empleo Cerca

Las credenciales de demostración son solo para pruebas en un navegador local:

- Usuario: `admin@demo.local`
- Contraseña: `demo123`

**Importante:** No usar estas credenciales en producción. Están verificadas en el código del frontend, lo cual **no es seguro**. La autenticación real debe hacerse con FastAPI.

## Pruebas rápidas

1. Sin iniciar sesión: `/ofertas` muestra «Ver detalles» en cada empleo; abrir `/detalle-oferta/1` y pulsar «Postular ahora».
2. Iniciar sesión con el usuario administrador de prueba: `/ofertas` muestra «Agregar oferta», «Editar» y «Eliminar», pero **no** «Ver detalles».
3. En modo administrador, regresar a `/inicio`: tampoco se muestran los enlaces «Ver detalles» de las ofertas recientes.
4. En modo administrador, escribir `/detalle-oferta/1`: no debe aparecer «Postular ahora».
5. En modo administrador, escribir `/postular/1`: debe redirigir a `/ofertas` sin guardar ninguna postulación.
6. Cerrar sesión: vuelve a mostrarse «Ver detalles» y queda habilitada la postulación de prueba.
7. En `/login` ya no aparecen las credenciales de prueba en pantalla.

Los empleos iniciales son ficticios. Toda la aplicación sigue siendo un **prototipo frontend** sin backend ni base de datos.
