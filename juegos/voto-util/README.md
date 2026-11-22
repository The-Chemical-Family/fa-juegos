# Voto útil

Juego web de campaña para las elecciones generales del 29N: tres niveles, todo en un único archivo HTML.

1. **Tasa a los megarricos**: tócalos cuando se asoman (si eres rápida, tasa doble o triple); a la gente currante, no.
2. **¡El 29N decidimos!**: elige provincia en el mapa y convence, persona a persona, a quien duda, con argumentos del programa, hasta arrebatar el último escaño a PP o Vox.
3. **Trivial del Frente Amplio**: preguntas rápidas con cuenta atrás.

Este juego es un workspace del monorepo `fa-juegos` y se publica en `https://juegoamplista.es/voto-util`.

## Modificar el juego

Requiere Node.js 20+.

```bash
npm install                        # desde la raíz del monorepo
npm run build -w juegos/voto-util  # regenera dist/index.html
npm run serve -w juegos/voto-util  # sirve dist/ para probarlo
```

No hay servidor de desarrollo: el ciclo es editar, construir y abrir. El código está en `src/VotoUtil.jsx` (juego) y `src/data.js` (medidas del programa).

## Publicación

El contenedor copia `dist/` a `/voto-util/` en el ensamblado del monorepo. Este juego no se publica por separado y ya no usa GitHub Pages ni la carpeta `docs/`.

`GAME_URL`, en `src/VotoUtil.jsx`, es la dirección que viaja en los mensajes de compartir. Se cambia a `https://juegoamplista.es/voto-util` en el despliegue en el que el dominio ya resuelve.

## Notas

- **Ranking**: sólo funciona dentro de Claude, donde la base de datos del artefacto es compartida. En cualquier otro alojamiento la lista aparece vacía y el puesto se calcula contra el historial local del navegador, que no guarda nombres. La decisión de producto es no tener ranking compartido en `juegoamplista.es`.
- **Enlace para compartir**: los mensajes de WhatsApp usan `GAME_URL`.
- **Música y sonidos**: generados en el navegador (Web Audio), sin archivos externos. El Himno de Riego es una versión libre de una obra de dominio público.
- **Personajes**: todos inventados; no aparecen personas reales.
- **Fuente de la tipografía**: usa *Archivo Black* si está disponible y, si no, una tipografía del sistema.
