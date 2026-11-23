---
name: anadir-juego-estatico
description: Añade al monorepo un juego de tipo estatico en juegos/<slug>/: un juego ya construido (HTML, CSS, JS y assets) que se sirve tal cual, sin package.json ni compilación. Copia el resultado construido, reescribe las rutas a /<slug>/, crea juego.json y verifica que se publica. Úsala cuando pidan añadir, incorporar, importar o publicar un juego existente que ya está construido, o cuando el juego venga de otra herramienta (React, Vue, un empaquetador propio). No la uses para juegos nuevos con Svelte: para eso está crear-juego-svelte.
---

# Añadir un juego estático

Un juego `estatico` es un artefacto: la carpeta `juegos/<slug>/` **es** lo que se
sirve en `/<slug>/`. No hay build, no hay `package.json`, no hay `node_modules`.
El ensamblado (`tools/ensamblar.mjs`) la copia tal cual, inyecta la analítica en
`index.html`, añade los botones de atrás y compartir antes de `</body>` y verifica cada
referencia. También exige dos imágenes por juego: `designs/og/<slug>.png`
(1200 × 630) para las tarjetas al compartir el enlace y
`designs/historias/<slug>.png` (1080 × 1920) para el botón de Instagram.

Si el material de origen necesita compilarse, compílalo fuera del monorepo y trae
solo el resultado. Aquí no se construye nada.

## Antes de tocar nada

| Dato | Regla |
| --- | --- |
| `slug` | Minúsculas, números y guiones (`^[a-z0-9]+(-[a-z0-9]+)*$`). Es la carpeta y el segmento de URL. |
| `nombre` | Texto visible en la lista del sitio. |
| `descripción` | Meta description; si no la dan, derívala del nombre. |
| `origen` | Carpeta ya construida (`index.html`, CSS, JS, assets) o proyecto con `dist/`. |
| `prefijo anterior` | Ruta con la que se sirvió antes (el `base` de su empaquetador), si no era la raíz. |
| `orden` | Número para la lista; por defecto 100. |
| `publicar` | Por defecto `false`; `true` cuando esté verificado. |

Comprueba que `juegos/<slug>` no exista. Si existe, para y pregunta.

## Paso 1 — copiar el juego

```bash
npm run nuevo-juego -- --tipo estatico --slug <slug> --nombre "<Nombre>" --descripcion "<descripción>" --origen <ruta> [--prefijo-anterior <segmento>] [--orden 10] [--publicar]
```

Qué hace `tools/nuevo-juego.mjs`:

- Si `--origen` tiene `dist/index.html`, copia `dist/`; si tiene `index.html`,
  copia la carpeta. Así sirve tanto el resultado como el proyecto que lo generó.
- Descarta `package.json`, lockfiles, `node_modules`, `dist/` anidado y archivos
  ocultos: justo lo que no puede llegar al artefacto.
- Con `--prefijo-anterior mi-juego` reescribe `/mi-juego/...` a `/<slug>/...` en
  los ficheros de texto (por ejemplo, si el juego se construyó con `base`
  `/mi-juego/`).
- Escribe `juego.json` con `"tipo": "estatico"`.

Sin `--origen` copia `tools/plantillas/estatico`, útil para empezar de cero.

Al terminar, el script ejecuta la verificación sobre la carpeta y **lista los
problemas que quedan**; no los corrige todos.

## Paso 2 — dejar las rutas correctas

Esta es la parte que más falla. Reglas:

- En `index.html`, **todas** las rutas de subrecursos son absolutas y llevan el
  slug: `<link href="/<slug>/css/estilos.css">`,
  `<script src="/<slug>/js/juego.js">`, `<img src="/<slug>/img/x.png">`.
  Una ruta relativa (`css/estilos.css`) se resolvería contra la raíz del dominio
  cuando la URL llega sin barra final.
- Dentro del **CSS** sí valen rutas relativas: se resuelven contra la hoja
  (`url(../img/fondo.png)`). Nunca salgas de la carpeta del juego.
- Nada de rutas protocolo-relativas (`//cdn...`): no existen en el despliegue.
- Nada de referencias a otros juegos (`/otro-juego/...`): solo se sirve `/<slug>/`.
- Las URLs generadas desde **JavaScript** también son `/<slug>/...`.
- Si el juego venía construido para la raíz (`/assets/...`), reescríbelas a
  `/<slug>/assets/...`.

## Paso 3 — limpiar el artefacto

- Sin `package.json`, sin `node_modules`, sin lockfiles, sin `dist/` dentro.
- Sin archivos ocultos (`.git`, `.DS_Store`, `.env`): no se copian, pero si
  creaste la carpeta a mano, bórralos.
- `README.md` y `juego.json` pueden quedarse: el ensamblado los excluye y no se
  sirven.
- Un `index.html` con `</head>` y `</body>` es obligatorio: antes de `</head>` se
  inyecta la analítica y antes de `</body>` los botones de atrás y compartir.
- `designs/og/<slug>.png` con la captura del juego a 1200 × 630, que es la que
  declaran `og:image` y `twitter:image`.
- `designs/historias/<slug>.png` (1080 × 1920) con el mensaje incrustado, que es
  lo que se comparte como historia/imagen en Instagram.

## Paso 4 — declarar los recursos que carga el JavaScript

La verificación solo ve lo que aparece en el HTML y en el CSS. Si el juego carga
un vídeo, un audio, un JSON o una fuente desde JavaScript, declara su ruta en
`assets`:

```json
{
  "nombre": "Mi juego",
  "tipo": "estatico",
  "publicar": true,
  "assets": ["video/intro.mp4", "datos/preguntas.json"]
}
```

Las rutas son relativas a la carpeta del juego y deben existir. Si declaras una
carpeta, necesita `index.html`.

## Paso 5 — verificar

```bash
npm run check     # valida el manifiesto y verifica la carpeta del juego tal cual
npm run build     # copia, inyecta analítica y botones, y verifica
npm run dev:todo  # http://localhost:5173/<slug>/ (sirve la carpeta, sin recarga)
```

En los `estatico`, `npm run check` verifica directamente la carpeta: no hace
falta construir ni esperar a `dist/`.

También puedes verificar solo tu juego:

```bash
node tools/verificar-juego.mjs juegos/<slug>
```

Criterios de aceptación:

- `npm run check` y `npm run build` terminan sin errores.
- `http://localhost:5173/<slug>/` y `http://localhost:5173/<slug>` funcionan.
- No hay 404 en la pestaña Red al recorrer el juego.
- El juego se ve bien sin depender de un servidor propio.

## Paso 6 — publicar

Pon `"publicar": true` en `juegos/<slug>/juego.json` y vuelve a construir. Mientras
esté en `false` el juego pasa las comprobaciones pero su URL da 404 y no aparece
en la lista.

## Límites que conviene decir al usuario

- **Solo archivos estáticos.** No hay backend, ni variables de entorno en
  ejecución, ni rutas reescritas por el servidor.
- **Rutas de SPA**: si el juego usa rutas de cliente (`/juego/nivel/2`), sin
  archivos detrás darán 404. Usa rutas con `#` (hash) o un único `index.html`.
- **Nada de compilar en el monorepo.** Si el origen tiene fuentes, `src/` o un
  `package.json`, el artefacto que se copia es el resultado ya construido.
- **El contenedor no renderiza el juego**: solo enlaza y sirve archivos. Cada
  recurso enlazado tiene que existir en la carpeta.

## Errores frecuentes

| Síntoma | Causa y arreglo |
| --- | --- |
| `un juego "estatico" no puede tener package.json` | Quita `package.json` (y `node_modules`) de la carpeta. |
| `"..." es una ruta relativa; usa /<slug>/...` | Ruta relativa en el HTML: hazla absoluta con el slug. |
| `"..." no se sirve desde /<slug>/` | La ruta apunta a otro prefijo (el antiguo `base`): reescríbela. |
| `"..." no existe en los archivos del juego` | Falta el archivo o está mal escrito; cópialo o corrige la ruta. |
| `index.html no tiene </head>` | Añade `</head>` para que se pueda inyectar la analítica. |
| `falta designs/og/<slug>.png` | Guarda la captura 1200 × 630 del juego con ese nombre. |
| `falta designs/historias/<slug>.png` | Genera la historia 1080 × 1920 del juego. |
| El juego se ve roto pero no hay errores en `check` | Recurso cargado desde JS: decláralo en `assets` y revisa la Red del navegador. |

Para diagnosticar en detalle, usa la skill `verificar-juego`.
