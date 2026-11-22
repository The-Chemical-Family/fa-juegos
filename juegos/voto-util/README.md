# Voto útil

Juego web de campaña para las elecciones generales del 29N: tres niveles, todo en un único archivo HTML.

1. **Tasa a los megarricos**: tócalos cuando se asoman (si eres rápida, tasa doble o triple); a la gente currante, no.
2. **¡El 29N decidimos!**: elige provincia en el mapa y convence, persona a persona, a quien duda, con argumentos del programa, hasta arrebatar el último escaño a PP o Vox.
3. **Trivial del Frente Amplio**: preguntas rápidas con cuenta atrás.

## Tipo de juego

Es un juego **estático ya construido**: `index.html` contiene el HTML, el CSS y el JS
empaquetados en el mismo archivo. No tiene `package.json`, no depende de ninguna herramienta y
no se compila: la carpeta del juego es el artefacto que se publica.

## Publicación

Se sirve en `https://juegoamplista.es/voto-util/`. El ensamblado copia la carpeta tal cual a
`apps/contenedor/static/voto-util/`; no se sube a mano a ningún sitio.

```bash
npm run build   # ensambla el sitio completo y verifica el juego
```

## Probar en local

```bash
npm install       # desde la raíz del monorepo
npm run dev:todo  # http://localhost:5173/voto-util/
```

Como no hay compilación, el ciclo es editar `index.html` y recargar.

## Notas

- **Ranking**: dentro de Claude el ranking es compartido entre jugadoras. Fuera de Claude (GitHub, tu web) se guarda solo en el navegador de cada persona. Para un ranking común en tu web habría que conectar un backend (por ejemplo, Firebase o Supabase).
- **Enlace para compartir**: los mensajes de WhatsApp apuntan a la URL definida en la constante `GAME_URL` del juego. Se cambia a `https://juegoamplista.es/voto-util` en el despliegue en el que el dominio ya resuelve.
- **Música y sonidos**: generados en el navegador (Web Audio), sin archivos externos. El Himno de Riego es una versión libre de una obra de dominio público.
- **Personajes**: todos inventados; no aparecen personas reales.
- **Fuente de la tipografía**: usa *Archivo Black* si está disponible y, si no, una tipografía del sistema.
- **Código fuente**: la versión React con esbuild que generó este archivo está archivada en `_archivo/voto-util-react/`; el monorepo no la publica.
