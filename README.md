# fa-juegos

Monorepo de los juegos web de campaña. Un único dominio sirve una lista de juegos y cada juego vive en su propia ruta:

- `/` — portada de los juegos, generada a partir de los manifiestos.
- `/quiz-bienestar/` — juego de preguntas y bienestar (Svelte 5 + Vite).
- `/desenmascara/` — derriba la fachada a mazazos (HTML, CSS y JS ya construidos).
- `/voto-util/` — voto útil (HTML, CSS y JS ya construidos).

El contenedor decide qué URL existe y qué enlaces aparecen. No renderiza el HTML de los juegos: cada juego se publica como artefacto estático.

## Los dos tipos de juego

Cada carpeta de `juegos/` es exactamente uno de estos dos tipos, y lo declara en su `juego.json`:

| `tipo` | Qué contiene la carpeta | Cómo se publica |
| --- | --- | --- |
| `svelte` | Aplicación Svelte + Vite (`package.json`, `src/`, `index.html`) | `npm run build` genera `dist/` y se copia |
| `estatico` | Juego ya construido: `index.html`, CSS, JS y assets, **sin** `package.json` | Se copia la carpeta tal cual |

No hay un tercer tipo. Un juego construido con otra herramienta (React, Vue, un empaquetador propio…) se publica como `estatico`: se construye fuera del monorepo y se deja aquí el resultado.

## Estructura

```
apps/contenedor/     contenedor SvelteKit (adapter-vercel)
juegos/<slug>/       un juego por carpeta, con juego.json
tools/               ensamblado, manifiestos, verificación y servidor estático
tools/plantillas/    esqueletos de los dos tipos
.github/skills/      skills de IA para crear y añadir juegos
_archivo/            código conservado que no se publica
```

## Comandos

```bash
npm install     # instala todos los workspaces (los juegos svelte)
npm run check   # valida manifiestos y verifica los artefactos de todos los juegos
npm run build   # construye los juegos svelte, copia los estáticos y construye el contenedor
npm run dev     # servidor de desarrollo del contenedor
npm run nuevo-juego -- --tipo svelte --slug <slug> --nombre "<Nombre>"   # crea un juego
```

`npm run build` es el único paso necesario para publicar: limpia lo copiado, construye los juegos `svelte` con `publicar: true`, copia los `estatico`, inyecta la analítica y verifica cada artefacto.

`npm run check` comprueba los dos tipos: en los `svelte` valida el manifiesto y, si existe `dist/`, sus referencias; en los `estatico` valida el manifiesto y verifica la carpeta directamente. Después ejecuta el `check` de cada workspace que lo declare.

## Verificar en local

Un solo comando levanta el sitio completo, con el contenedor sirviendo cada juego en su ruta real:

```bash
npm run dev:todo
```

- `http://localhost:5173/` — el sitio como se despliega: la lista y todos los juegos bajo el mismo origen.
- Un puerto por juego, desde el 5174, en el mismo orden en que aparecen en la lista. El comando imprime la URL de cada uno.

Los juegos `svelte` se sirven con su servidor de desarrollo y recargan solos, también a través del contenedor. Los `estatico` se sirven desde su propia carpeta: edita, recarga y listo.

Antes de arrancar comprueba los puertos y construye el sitio una vez, porque la lista sale de lo que hay copiado en `static/`.

Si solo quieres revisar el resultado del despliegue, sin servidores de desarrollo:

```bash
npm run build
npm run preview   # http://localhost:4173/
```

`preview` sirve exactamente el HTML y los ficheros que genera el ensamblado, incluido el 404 y las rutas con y sin barra final.

## El manifiesto `juego.json`

Toda carpeta de `juegos/` que tenga `juego.json` es un juego; las que no lo tienen se ignoran.

```json
{
  "nombre": "Nombre visible",
  "tipo": "svelte",
  "publicar": true,
  "orden": 10,
  "assets": ["ruta/a/un/recurso/que/debe/existir"]
}
```

- `nombre` — texto visible en la lista. Obligatorio.
- `tipo` — `"svelte"` o `"estatico"`. Obligatorio.
- `publicar` — con `false` el juego pasa las comprobaciones pero no se construye, no se copia y su URL da 404. Cambiarlo exige volver a desplegar; no hay interruptor en caliente.
- `orden` — número para ordenar la lista; por defecto 100 y, a igualdad, orden alfabético por `nombre`.
- `assets` — rutas opcionales, para que la verificación detecte recursos que el HTML no referencia, como un vídeo cargado desde JavaScript.

Los manifiestos se validan al leerlos: un `tipo` desconocido, un juego `estatico` con `package.json`, un juego `svelte` sin `svelte`, sin `build` o sin `dev`, o una carpeta sin `index.html` detienen el build con un mensaje que nombra el fichero.

## Skills de IA

Las tareas de crear un juego y de añadirlo están automatizadas como skills que
funcionan igual en Copilot y en Claude:

| Skill | Para qué |
| --- | --- |
| `crear-juego-svelte` | Crea un juego Svelte 5 nuevo desde la plantilla, lo registra como workspace y lo deja listo para implementar y verificar. |
| `anadir-juego-estatico` | Incorpora un juego ya construido, reescribe las rutas a `/<slug>/` y lo deja servible. |
| `verificar-juego` | Sube la verificación (manifiesto, artefacto y sitio) y traduce cada mensaje de error. |

Viven en [.github/skills/](.github/skills/) y `.claude/skills` es un enlace
simbólico a esa misma carpeta, para que Copilot y Claude lean una sola copia: al
añadir una skill basta con crearla en `.github/skills/<nombre>/SKILL.md`. (En
Windows hace falta `git config core.symlinks true` para que el enlace se cree
como tal al clonar.)

Las dos primeras usan el mismo andamiaje, `npm run nuevo-juego`, que copia la
plantilla, sustituye los marcadores, escribe `juego.json` y se niega a pisar una
carpeta existente:

```bash
npm run nuevo-juego -- --tipo svelte   --slug <slug> --nombre "<Nombre>" [--descripcion "<texto>"] [--orden 10] [--publicar]
npm run nuevo-juego -- --tipo estatico --slug <slug> --nombre "<Nombre>" --origen <ruta construida> [--prefijo-anterior <segmento>] [--publicar]
```

## Añadir un juego Svelte

1. Copiar `tools/plantillas/svelte/` a `juegos/<slug>/` y sustituir `__SLUG__`, `__NOMBRE__` y `__DESCRIPCION__`. Lo hace `npm run nuevo-juego -- --tipo svelte --slug <slug> --nombre "<Nombre>"`; después, `npm install` para enlazar el workspace nuevo.
2. `vite.config.ts` fija `base: '/<slug>/'`. No lo cambies: el juego se sirve bajo esa ruta y la URL sin barra final resolvería los recursos contra la raíz del dominio.
3. Mantener `dev`, `build` (genera `dist/`) y `check` en `package.json`.
4. Poner `publicar: true` en `juego.json` cuando esté listo.

Si el juego carga un recurso desde JavaScript, créalo en `static/` con `publicDir: 'static'` en `vite.config.ts` y declara la ruta en `assets`.

## Añadir un juego estático ya construido

1. Copiar dentro de `juegos/<slug>/` el resultado ya construido: `index.html`, CSS, JS y los assets que necesite. Con `npm run nuevo-juego -- --tipo estatico --slug <slug> --nombre "<Nombre>" --origen <ruta>` la copia descarta `package.json`, `node_modules` y los archivos ocultos.
2. **No** añadir `package.json`, ni `node_modules`, ni un paso de compilación.
3. Usar rutas absolutas `/<slug>/...` en `index.html` para los subrecursos, y relativas solo dentro del CSS. Si el juego se construyó para otro prefijo, `--prefijo-anterior <segmento>` lo reescribe.
4. Crear `juego.json` con `"tipo": "estatico"`.
5. El `index.html` debe tener `</head>`: ahí se inyecta la analítica.

La plantilla mínima está en `tools/plantillas/estatico/`. La carpeta del juego es el artefacto: lo que hay en ella es lo que se sirve, salvo `juego.json`, `README.md` y los archivos ocultos.

## Despliegue

- Proyecto de Vercel con la raíz del repositorio como Root Directory y `npm run build` como build command.
- La analítica sin cookies se inyecta en el paso de ensamblado y usa `/_vercel/insights/script.js`, que sólo existe si Vercel Web Analytics está activado en el proyecto.
- La lista y el 404 se prerenderizan; las rutas no encontradas las atiende la función de reserva del adapter.

## Notas de mantenimiento

- Todo el monorepo usa una sola versión de Vite, la 8.3.8: es la que exigen SvelteKit 3 y el adaptador de Vercel que despliega el contenedor. `@sveltejs/vite-plugin-svelte` va emparejado en su versión 7, porque la 5 solo acepta Vite 6. Al subir Vite hay que cambiar la versión en los tres `package.json` a la vez: contenedor, juego y plantilla.
- Node 22.17 o superior: es el mínimo de SvelteKit 3 y de Vitest 5.
- `apps/contenedor/static/<slug>/` es salida generada: se ignora en git y la recrea cada `npm run build`.
- Los juegos `estatico` no son workspaces de npm; no tienen `package.json` ni scripts propios. Se sirven y se copian desde los scripts de `tools/`.
