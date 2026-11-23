# Corrección para publicar ofertas

- El botón Publicar oferta permanece habilitado; el navegador indica los campos obligatorios faltantes.
- El campo Sueldo referencial necesita que se escriba un valor; el texto gris es solo un ejemplo.
- La oferta recién agregada aparece en primera posición y se limpian los filtros activos tras guardar.
- Las ofertas nuevas utilizan las mismas tarjetas HTML/CSS que las existentes.
- Los datos se guardan en `localStorage` de este navegador, no en una base de datos remota.

## Prueba rápida

1. Inicia sesión como administrador y abre Ofertas.
2. Pulsa Agregar oferta y completa todos los campos, incluido Sueldo referencial.
3. Pulsa Publicar oferta y comprueba que aparece como primera tarjeta.
4. Recarga /ofertas: la nueva tarjeta debe persistir en el mismo navegador.
