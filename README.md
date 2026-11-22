# fa-juegos

Monorepo de los juegos web de campaña. Un único dominio sirve una lista de juegos y cada juego vive en su propia ruta:

- `/` — lista de enlaces de texto, generada a partir de los manifiestos.
- `/quiz-bienestar/` — juego de preguntas y bienestar (Svelte 5 + Vite).
- `/voto-util/` — voto útil (React 18 + esbuild).

El contenedor decide qué URL existe y qué enlaces aparecen. No renderiza el HTML de los juegos: cada juego se construye con su propia herramienta y se publica como artefacto estático.

## Estructura

```
apps/contenedor/     contenedor SvelteKit (adapter-vercel)
juegos/<slug>/       un juego por carpeta
tools/               ensamblado, manifiestos y verificación
```

## Comandos

```bash
npm install     # instala todos los workspaces
npm run check   # validación de todos los juegos y del contenedor
npm run build   # construye los juegos publicados, los copia y construye el contenedor
npm run dev     # servidor de desarrollo del contenedor
```

`npm run build` es el único paso necesario para publicar: limpia lo copiado, construye los juegos con `publicar: true`, los copia a `apps/contenedor/static/<slug>/`, inyecta la analítica y verifica cada artefacto.

## Verificar en local

Un solo comando levanta el sitio completo, con el contenedor sirviendo cada juego en su ruta real:

```bash
npm run dev:todo
```

- `http://localhost:5173/` — el sitio como se despliega: la lista y todos los juegos bajo el mismo origen.
- Un puerto por juego, desde el 5174 y en orden alfabético. El comando imprime la URL de cada uno y avisa de cuáles no tienen recarga en caliente.

Los juegos con script `dev` se sirven con su servidor de desarrollo y recargan solos, también a través del contenedor. Los que sólo tienen `serve` se sirven ya construidos: edita, `npm run build -w juegos/<slug>` y recarga.

Antes de arrancar comprueba los puertos y construye el sitio una vez, porque la lista sale de lo que hay copiado en `static/`.

Si solo quieres revisar el resultado del despliegue, sin servidores de desarrollo:

```bash
npm run build
npm run preview   # http://localhost:4173/
```

`preview` sirve exactamente el HTML y los ficheros que genera el ensamblado, incluido el 404 y las rutas con y sin barra final.

## Añadir un juego

1. Crear `juegos/<slug>/` con un `package.json` que tenga un script `build`. Si el juego ya es HTML, CSS y JS sin herramienta, basta con `node ../../tools/estatico.mjs dist index.html css js`.
2. Ese build debe dejar `dist/index.html` y sus recursos, y funcionar servido bajo `/<slug>/` (usa `base: '/<slug>/'` o rutas relativas).
3. Crear `juegos/<slug>/juego.json`:

```json
{
  "nombre": "Nombre visible",
  "publicar": true,
  "assets": ["ruta/a/un/recurso/que/debe/existir"]
}
```

`assets` es opcional y sirve para que la verificación detecte recursos que el HTML no referencia, como un vídeo cargado desde JavaScript.

No hay que tocar el contenedor ni los scripts: la lista y el despliegue se generan solos.

## El flag `publicar`

Se evalúa en el build. Con `false`, el juego pasa `check` pero no se construye, no se copia y su URL da 404. Cambiarlo exige volver a desplegar; no hay interruptor en caliente.

## Despliegue

- Proyecto de Vercel con la raíz del repositorio como Root Directory y `npm run build` como build command.
- La analítica sin cookies se inyecta en el paso de ensamblado y usa `/_vercel/insights/script.js`, que sólo existe si Vercel Web Analytics está activado en el proyecto.
- La lista y el 404 se prerenderizan; las rutas no encontradas las atiende la función de reserva del adapter.

## Notas de mantenimiento

- El `overrides` de la raíz fija la versión de Vite que usa Vitest. El contenedor necesita Vite 8 y quiz-bienestar Vite 6; sin el override, `svelte-check` compara dos copias distintas de los tipos de Vite y falla por un choque que no existe en ejecución.
- `apps/contenedor/static/<slug>/` es salida generada: se ignora en git y la recrea cada `npm run build`.
