# Voto útil

Juego web de campaña para las elecciones generales del 29N: tres niveles, todo en un único archivo HTML.

1. **Tasa a los megarricos**: tócalos cuando se asoman (si eres rápida, tasa doble o triple); a la gente currante, no.
2. **¡El 29N decidimos!**: elige provincia en el mapa y convence, persona a persona, a quien duda, con argumentos del programa, hasta arrebatar el último escaño a PP o Vox.
3. **Trivial del Frente Amplio**: preguntas rápidas con cuenta atrás.

## Publicación

Este juego es un workspace de `fa-juegos` y se sirve en `https://juegoamplista.es/voto-util`.
El contenedor copia su `dist/` en el ensamblado del monorepo; no se publica por separado ni usa
GitHub Pages.

```bash
npm run build -w juegos/voto-util   # regenera dist/index.html
npm run build                        # ensambla el sitio completo
```

## Modificar el juego

Requiere Node.js 18+.

```bash
npm install                        # desde la raíz del monorepo
npm run build -w juegos/voto-util  # regenera dist/index.html
npm run serve -w juegos/voto-util  # sirve dist/ para probarlo
```

No hay servidor de desarrollo: el ciclo es editar, construir y abrir. El código está en
`src/VotoUtil.jsx` (juego) y `src/data.js` (medidas del programa).

## Notas

- **Ranking**: dentro de Claude el ranking es compartido entre jugadoras. Fuera de Claude (GitHub, tu web) se guarda solo en el navegador de cada persona. Para un ranking común en tu web habría que conectar un backend (por ejemplo, Firebase o Supabase).
- **Enlace para compartir**: los mensajes de WhatsApp apuntan a la URL definida en `GAME_URL` dentro de `src/VotoUtil.jsx`. Se cambia a `https://juegoamplista.es/voto-util` en el despliegue en el que el dominio ya resuelve.
- **Música y sonidos**: generados en el navegador (Web Audio), sin archivos externos. El Himno de Riego es una versión libre de una obra de dominio público.
- **Personajes**: todos inventados; no aparecen personas reales.
- **Fuente de la tipografía**: usa *Archivo Black* si está disponible y, si no, una tipografía del sistema.
