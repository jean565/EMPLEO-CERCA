# Empleo Cerca - SweetAlert2

## Instalación (una sola vez)

Desde la carpeta `Empleo_Cerca`:

```bash
npm install sweetalert2
ng serve
```

El comando actualiza `package-lock.json` e instala la librería.

## Archivos modificados

- `Pages/ofertas/ofertas.ts`: confirmar eliminación, notificar publicación y edición.
- `Pages/admin/admin.ts`: las mismas alertas en el panel antiguo, por compatibilidad.
- `Pages/login/login.ts` y `login.html`: error de credenciales con ventana emergente.
- `Pages/registro/registro.ts` y `registro.html`: confirmación de datos validados.
- `Pages/postular/postular.ts` y `postular.html`: confirmación de postulación guardada.
- `package.json`: dependencia de SweetAlert2.

## Pruebas

1. Entrar como administrador y pulsar **Eliminar** en Ofertas.
2. Presionar **Cancelar** y comprobar que la oferta sigue visible.
3. Presionar **Sí, eliminar** y comprobar que desaparece y se muestra la confirmación.
4. Crear una oferta y comprobar el aviso de publicación.
5. Editar la oferta y comprobar el aviso de actualización.
6. Probar una contraseña incorrecta en Inicio de sesión.
7. Completar el formulario Registro y probar Postular como postulante autenticado.

**Nota:** La autenticación y los datos ya provienen de la API FastAPI. SweetAlert2
solo mejora los mensajes visuales; no interviene en la seguridad.
