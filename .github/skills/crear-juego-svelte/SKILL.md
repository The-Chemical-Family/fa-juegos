---
name: crear-juego-svelte
description: Crea un juego nuevo de tipo svelte (Svelte 5 + Vite 8 + TypeScript) en juegos/<slug>/ a partir de tools/plantillas/svelte, lo registra como workspace y lo deja listo para implementar, verificar y publicar. Úsala cuando pidan crear un juego nuevo, añadir un juego interactivo, montar una trivia, un cuestionario o un minijuego, o empezar un juego desde cero con Svelte. No la uses para juegos ya construidos: para eso está anadir-juego-estatico.
---

# Crear un juego Svelte

Cada juego vive en `juegos/<slug>/` y se declara en `juego.json`. El contenedor
(`apps/contenedor`) sirve el juego en `/<slug>/` y construye la lista a partir de
lo que `npm run build` copia a `apps/contenedor/static/`. No hay otro registro:
crear la carpeta con su manifiesto es todo lo que hace falta.

## Antes de tocar nada

Reúne estos datos. Si falta el slug o el nombre, **pregúntalos**; no los inventes
en silencio.

| Dato | Regla |
| --- | --- |
| `slug` | Minúsculas, números y guiones (`^[a-z0-9]+(-[a-z0-9]+)*$`). Sin acentos, espacios ni mayúsculas. Es a la vez la carpeta, el `name` del paquete npm y el segmento de URL. |
| `nombre` | Texto visible en la lista del sitio. |
| `descripción` | Meta description y `og:description`. Si no la dan, derívala del nombre. |
| `orden` | Número para la lista; por defecto 100. Solo si lo piden o para colocarlo junto a juegos afines. |
| `publicar` | Por defecto `false`. Se pone en `true` cuando el juego esté verificado y el usuario quiera verlo en el sitio. |

Comprueba que no exista: `ls juegos/<slug>`. Si existe, para y pregunta: nunca
sobrescribas trabajo de otro juego.

## Paso 1 — andamiaje

```bash
npm run nuevo-juego -- --tipo svelte --slug <slug> --nombre "<Nombre>" --descripcion "<descripción>" [--orden 10] [--publicar]
```

`tools/nuevo-juego.mjs` copia `tools/plantillas/svelte`, sustituye `__SLUG__`,
`__NOMBRE__` y `__DESCRIPCION__` (escapando HTML donde toca), escribe `juego.json`
y se niega a crear nada si la carpeta ya existe. No copies la plantilla a mano.

## Paso 2 — registrar el workspace

```bash
npm install
```

`juegos/*` es un glob de workspaces: hasta que no se ejecuta `npm install` en la
raíz no existen los enlaces a `vite`, `svelte` y `svelte-check` del paquete
nuevo, y `npm run build -w juegos/<slug>` falla con un módulo desconocido.

Comprueba que arranca limpio antes de escribir código:

```bash
npm run check -w juegos/<slug>
```

## Paso 3 — implementar el juego

Estructura de la plantilla:

```
juegos/<slug>/
  index.html          # entrada: <div id="app"> y <script type="module" src="/src/main.ts">
  vite.config.ts      # base: '/<slug>/' — no lo cambies
  svelte.config.js
  tsconfig.json       # strict, sin emitir
  juego.json          # manifiesto del juego
  src/main.ts         # mount(App, ...)
  src/App.svelte      # pantalla inicial
  src/app.css         # estilos globales
```

Convenciones que ya sigue `juegos/quiz-bienestar` y que conviene mantener:

- **Componentes** en `src/componentes/*.svelte`, con el nombre en PascalCase
  (`Mapa.svelte`, `BarraEnergia.svelte`). `App.svelte` orquesta pantallas.
- **Lógica pura** en `src/lib/*.ts` (`reglas.ts`, `estado.ts`, `azar.ts`,
  `persistencia.ts`). Recibe datos y devuelve datos: así se puede probar sin DOM.
- **Contenido** (preguntas, textos, niveles) en `src/lib/contenido/*.json`, no
  incrustado en los componentes.
- **Tipos** compartidos en `src/lib/tipos.ts`.
- **Svelte 5 con runes**: `$state`, `$derived`, `$effect`, `$props`. No uses
  `export let`, `$:` ni stores de Svelte 4 en código nuevo.
- **TypeScript estricto**: `npm run check` corre `svelte-check --fail-on-warnings`,
  así que una variable sin usar o un tipo implícito rompe la verificación.
- **Accesibilidad mínima**: controles con etiqueta, foco visible, navegación con
  teclado y respeto a `prefers-reduced-motion` en animaciones.
- **Persistencia**: si guardas progreso, usa `localStorage` con lectura defensiva
  (`try/catch` y validación del JSON) y una clave por juego (`<slug>:...`).

Mantén intactos `index.html` (`<div id="app">`, `</head>` y el script a
`/src/main.ts`) y `base: '/<slug>/'` en `vite.config.ts`.

### Recursos que se cargan en tiempo de ejecución

Si el juego carga un vídeo, un audio o una imagen desde JavaScript:

1. Crea `static/` y copia ahí el archivo.
2. Añade `publicDir: 'static'` a `vite.config.ts`.
3. Declara la ruta en `assets` de `juego.json`:

```json
{ "nombre": "Mi juego", "tipo": "svelte", "publicar": true, "assets": ["video/intro.mp4"] }
```

Sin declararla, la verificación no comprueba que el archivo llegue a `dist/` y un
error de ruta solo se ve en producción. Referéncialo como `/<slug>/video/intro.mp4`.

### Pruebas (solo si las piden)

La plantilla **no** trae dependencias de test. Para añadirlas, replica
`juegos/quiz-bienestar`: `vitest`, `jsdom`, `@testing-library/svelte` y `tsx` en
`devDependencies`, un `src/pruebas/preparacion.ts`, y un `vite.config.ts` que use
`defineConfig` de `vitest/config` con esta condición, necesaria para que
`mount` exista en tests:

```ts
resolve: mode === 'test' ? { conditions: ['browser'] } : {},
test: { environment: 'jsdom', setupFiles: ['src/pruebas/preparacion.ts'], include: ['src/**/*.test.ts'] }
```

Añade entonces `"test": "vitest run"` al `package.json` del juego.

## Paso 4 — verificar

```bash
npm run check     # manifiestos de todos los juegos + svelte-check de los workspaces
npm run build     # construye, copia, inyecta analítica y botón de compartir, y verifica
npm run dev:todo  # http://localhost:5173/<slug>/ con recarga en caliente
```

Criterios de aceptación:

- `npm run check` termina sin errores ni avisos.
- `npm run build` lista `publicado: /<slug>/` (o `oculto:` si `publicar: false`).
- La URL `http://localhost:5173/<slug>/` carga el juego sin errores de consola,
  incluida la versión sin barra final.
- El juego funciona con teclado y sin recursos externos que puedan caerse.

## Paso 5 — publicar

Cuando el usuario lo pida y el juego esté verificado, pon `"publicar": true` en
`juegos/<slug>/juego.json`. Se aplica en el siguiente `npm run build`/despliegue;
no hay interruptor en caliente.

## Reglas duras

- **No cambies `base`**: siempre `'/<slug>/'`. Con base relativa, la URL sin
  barra final resuelve los recursos contra la raíz del dominio y el juego se
  queda sin JS ni CSS.
- **Versiones idénticas a la plantilla**: Vite `8.3.8`,
  `@sveltejs/vite-plugin-svelte` `7.3.1`, `svelte` `5.59.1`, `svelte-check`
  `4.7.8`, `typescript` `5.9.3`. Todo el monorepo comparte una sola versión de
  Vite; si hay que subirla, se cambia en contenedor, juego y plantilla a la vez.
- **`package.json.name` = slug.** npm exige nombres de workspace únicos y la URL
  depende del nombre de la carpeta.
- **No edites `apps/contenedor/static/`**: es salida generada y está ignorada en
  git. Todo cambio va en `juegos/<slug>/`.
- **`dist/` no se versiona** (lo ignora `.gitignore` de la raíz).
- **Un juego por carpeta.** No anides juegos ni metas dos manifiestos.

## Errores frecuentes

| Síntoma | Causa y arreglo |
| --- | --- |
| `Cannot find package 'vite'` al construir el juego | Falta `npm install` en la raíz tras crear el workspace. |
| El juego carga sin estilos en `/<slug>` | `base` distinta del slug: restaura `base: '/<slug>/'`. |
| `svelte-check` falla por un aviso | `--fail-on-warnings`: quita la variable sin usar o corrige el tipo. |
| El juego no aparece en la lista | `publicar: false`, o no se ha ejecutado `npm run build`. |
| `"..." no existe en los archivos del juego` al verificar | El recurso no está en `dist/`: muévelo a `static/` o corrige la ruta. |

Para diagnosticar la verificación en detalle, usa la skill `verificar-juego`.
