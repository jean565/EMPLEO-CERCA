# Corrección para publicar ofertas

- El formulario valida los campos obligatorios antes de enviar.
- El campo Sueldo referencial necesita que se escriba un valor; el texto gris es solo un ejemplo.
- La oferta se guarda en la API y el listado se recarga desde el servidor.
- Las ofertas nuevas utilizan las mismas tarjetas HTML/CSS que las existentes.

## Prueba rápida

1. Inicia sesión como administrador y abre Ofertas.
2. Pulsa Agregar oferta y completa todos los campos, incluido Sueldo referencial.
3. Pulsa Publicar oferta: SweetAlert2 confirma y la oferta aparece en el listado.
4. Recarga /ofertas: la oferta sigue visible porque está guardada en SQL Server.
5. Edita o elimina la oferta y comprueba que el cambio se mantiene al recargar.
