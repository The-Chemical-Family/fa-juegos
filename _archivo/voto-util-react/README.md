# Voto útil (fuente React, archivada)

Fuente del juego escrita en React 18 y empaquetada con esbuild. Ya no es un juego del monorepo:
`fa-juegos` solo admite aplicaciones Svelte o juegos estáticos ya construidos.

El juego publicado vive en `juegos/voto-util/` como un único `index.html` generado a partir de
este código. Para volver a generarlo:

```bash
cd _archivo/voto-util-react
npm install
npm run build   # escribe dist/index.html
```

Juego web de campaña para las elecciones generales del 29N: tres niveles, todo en un único archivo HTML.

1. **Tasa a los megarricos**: tócalos cuando se asoman (si eres rápida, tasa doble o triple); a la gente currante, no.
2. **¡El 29N decidimos!**: elige provincia en el mapa y convence, persona a persona, a quien duda, con argumentos del programa, hasta arrebatar el último escaño a PP o Vox.
3. **Trivial del Frente Amplio**: preguntas rápidas con cuenta atrás.

## Publicación

El juego se publica desde `juegos/voto-util/`, donde está el `index.html` ya construido. Esta
carpeta es solo la fuente: no es un workspace, no la lee ningún script del monorepo y no se
despliega.

## Modificar el juego

Requiere Node.js 18+.

```bash
cd _archivo/voto-util-react
npm install        # instala react y esbuild
npm run build      # regenera dist/index.html
npm run serve      # sirve dist/ para probarlo
```

Después, copiar `dist/index.html` a `juegos/voto-util/index.html`. El código está en
`src/VotoUtil.jsx` (juego) y `src/data.js` (medidas del programa).

## Notas

- **Ranking**: dentro de Claude el ranking es compartido entre jugadoras. Fuera de Claude (GitHub, tu web) se guarda solo en el navegador de cada persona. Para un ranking común en tu web habría que conectar un backend (por ejemplo, Firebase o Supabase).
- **Enlace para compartir**: los mensajes de WhatsApp apuntan a la URL definida en `GAME_URL` dentro de `src/VotoUtil.jsx`. Se cambia a `https://juegoamplista.es/voto-util` en el despliegue en el que el dominio ya resuelve.
- **Música y sonidos**: generados en el navegador (Web Audio), sin archivos externos. El Himno de Riego es una versión libre de una obra de dominio público.
- **Personajes**: todos inventados; no aparecen personas reales.
- **Fuente de la tipografía**: usa *Archivo Black* si está disponible y, si no, una tipografía del sistema.
