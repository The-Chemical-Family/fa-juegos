---
name: verificar-juego
description: Comprueba y depura un juego del monorepo fa-juegos, sea svelte o estatico: valida el manifiesto juego.json, verifica las rutas y los assets del artefacto, construye el sitio y lo sirve en local. Úsala cuando falle npm run check o npm run build, cuando un juego dé 404 o no aparezca en la lista, cuando falte un recurso, cuando la URL sin barra final cargue rota, o antes de publicar un juego.
---

# Verificar un juego

El monorepo valida en tres capas y conviene subirlas en orden: primero el
manifiesto, después el artefacto, por último el sitio ensamblado.

## 1. Comprobación completa

```bash
npm run check
```

Hace dos cosas:

1. `tools/verificar-juegos.mjs` lee y valida cada `juegos/*/juego.json` y su
   estructura (`tools/manifiestos.mjs`). En los `svelte`, si existe `dist/`,
   verifica también sus referencias; en los `estatico` verifica la carpeta.
2. `npm run check --workspaces --if-present`: `svelte-check --fail-on-warnings`
   en cada juego Svelte (y el `check` propio de cada workspace, como la
   validación de contenido de `quiz-bienestar`).

## 2. Un solo juego

```bash
node tools/verificar-juego.mjs juegos/<slug>
```

Comprueba el artefacto y nombra cada problema. En un `estatico` verifica la
carpeta del juego; en un `svelte` verifica `juegos/<slug>/dist/`, así que antes
hay que construir:

```bash
npm run build -w juegos/<slug>
node tools/verificar-juego.mjs juegos/<slug>
```

Qué exige la verificación:

- `index.html` existe y tiene `</head>` (analítica) y `</body>` (botón de
  compartir).
- Existe `designs/og/<slug>.png`, la captura de 1200 × 630 que declara `og:image`.
- En el HTML, todo `src`/`href`/`poster` y todo `url()`/`@import` es absoluto y
  empieza por `/<slug>/`; no se admiten rutas protocolo-relativas (`//host`).
- En el CSS se admiten rutas relativas, pero no pueden salir de la carpeta.
- Cada ruta existe de verdad en disco (un directorio necesita `index.html`).
- Cada ruta declarada en `assets` del manifiesto existe.

## 3. El sitio ensamblado

```bash
npm run build     # limpia static/, construye los svelte, copia los estatico,
                  # inyecta analítica y botón de compartir, y verifica
npm run dev:todo  # servidores de desarrollo + contenedor en http://localhost:5173/
npm run preview   # sirve exactamente lo construido en http://localhost:4173/
```

`npm run build` termina con la lista de lo publicado y lo oculto. Si un juego
está en `oculto`, es porque tiene `publicar: false`.

## Diagnosticar por síntoma

| Mensaje o síntoma | Significado | Arreglo |
| --- | --- | --- |
| `falta juegos/<slug>/index.html` | La carpeta no es un juego servible. | Añade `index.html` en la raíz del juego. |
| `"tipo" debe ser "svelte" o "estatico"` | `juego.json` con otro tipo. | Corrige el manifiesto; no hay un tercer tipo. |
| `un juego "estatico" no puede tener package.json` | El artefacto arrastra un proyecto. | Borra `package.json`, lockfiles y `node_modules`; si necesita build, constrúyelo fuera. |
| `un juego "svelte" debe declarar la dependencia "svelte"` | Falta `svelte` en `dependencies`/`devDependencies`. | Copia el `package.json` de `tools/plantillas/svelte`. |
| `un juego "svelte" debe tener un script "build"` / `"dev"` | El paquete no se puede construir ni desarrollar. | Añade `"build": "vite build"` y `"dev": "vite"`. |
| `"publicar" debe ser true o false` | El manifiesto tiene `"publicar": "true"` o similar. | Usa un booleano JSON. |
| `"orden" debe ser un número` | `orden` entre comillas. | Quita las comillas. |
| `"assets" debe ser una lista de rutas` | `assets` no es un array de strings. | Usa `["video/x.mp4"]`. |
| `index.html no tiene </head>` | No se puede inyectar la analítica. | Añade `</head>` al documento. |
| `falta designs/og/<slug>.png` | No hay captura para `og:image`. | Guarda el juego a 1200 × 630 en `designs/og/<slug>.png`. |
| `"..." es una ruta relativa; usa /<slug>/...` | Ruta relativa en el HTML. | Prefija `/<slug>/`. |
| `"..." no se sirve desde /<slug>/` | Ruta con otro prefijo (el `base` antiguo o la raíz). | Reescríbela a `/<slug>/...`. |
| `"..." sale de la carpeta del juego` | Un `../` en el CSS escapa del artefacto. | Copia el recurso dentro del juego. |
| `"..." se sirve por protocolo relativo` | `//cdn...` no existe en el despliegue. | Usa una URL `https:` o sirve el archivo desde el juego. |
| `"..." no existe en los archivos del juego` | Referencia a un archivo que no está en el artefacto. | Corrige la ruta o añade el archivo; en Svelte suele faltar `static/` + `publicDir`. |
| `el recurso declarado "..." es una carpeta sin index.html` | `assets` apunta a un directorio sin índice. | Declara el archivo concreto o añade `index.html`. |
| El juego no aparece en la lista | No está publicado o no se ha construido. | `publicar: true`, después `npm run build`; la lista sale de `apps/contenedor/static/`. |
| El juego carga sin CSS ni JS en `/<slug>` (sin barra final) | `base` incorrecta o rutas relativas. | `base: '/<slug>/'` y rutas absolutas. |
| `Cannot find package 'vite'` en un workspace | Falta `npm install` tras añadir el juego. | Ejecuta `npm install` en la raíz. |
| `El puerto 517x (...) está ocupado` | Otro proceso usa el puerto de `dev:todo`. | Para ese proceso antes de arrancar. |
| Cambios que no se ven en `preview` | Estás mirando el último build. | Vuelve a ejecutar `npm run build`. |

## Reglas que la verificación no puede adivinar

- Una URL **nueva** no existe: solo se sirve lo que está en `apps/contenedor/static/`
  tras el build. No hay rutas dinámicas por juego.
- `apps/contenedor/static/` es salida generada e ignorada en git: nunca edites ahí.
- `publicar: false` no rompe el build, pero deja el juego oculto y su URL en 404.
- Un recurso que solo carga el JavaScript no se ve en el HTML: si no está en
  `assets`, nadie lo comprueba.

## Criterio de aceptación antes de publicar

- `npm run check` sin errores.
- `npm run build` sin errores y con el juego en la lista de publicados.
- `http://localhost:5173/<slug>/` y `http://localhost:5173/<slug>` funcionan, sin
  404 ni errores de consola.
- Si es Svelte: `npm run build -w juegos/<slug>` genera `dist/index.html`.
- Si es estático: la carpeta no contiene `package.json` ni `node_modules`.

Para crear o añadir juegos, usa `crear-juego-svelte` o `anadir-juego-estatico`.
