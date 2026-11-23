# fa-juegos

Monorepo de los juegos web de campaña. Un único dominio sirve una lista de juegos y cada juego vive en su propia ruta:

- `/` — portada de los juegos, generada a partir de los manifiestos.
- `/quiz-bienestar/` — juego de preguntas y bienestar (Svelte 5 + Vite).
- `/el-pueblo-vs-fachalecos/` — resiste a los fachas (HTML, CSS y JS ya construidos).
- `/rompe-el-fachamuro/` — derriba el muro a mazazos (HTML, CSS y JS ya construidos).
- `/tasa-a-los-ricos/` — reparte la riqueza a base de tasas (HTML, CSS y JS ya construidos).
- `/trivial-del-frente/` — trivial de programa (HTML, CSS y JS ya construidos).
- `/voto-util/` — voto útil (HTML, CSS y JS ya construidos).

El contenedor decide qué URL existe y qué enlaces aparecen. No renderiza el HTML de los juegos: cada juego se publica como artefacto estático.

La portada reproduce un audio de entrada en cada visita, salvo que el visitante lo silencie con el botón de arriba a la derecha; ese estado se recuerda entre visitas. Suena en autoplay donde el navegador lo permite y, si lo bloquea, espera al primer gesto.

La portada no hace scroll: ocupa exactamente el alto de la ventana y la rejilla de luceros se queda con el espacio que dejan la cabecera y los protagonistas. El número de columnas depende de la proporción de la pantalla y nunca pasa del número de juegos publicados, y cada lucero se ajusta al hueco que le toca en ancho y en alto.

La tipografía del cartel es Impact: además de la del sistema, se sirve desde el propio contenedor (`src/lib/assets/impact-webfont.*`) para que Android y Linux vean lo mismo.

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
designs/og/          captura 1200 × 630 de cada juego para og:image
designs/historias/   historia 1080 × 1920 de cada juego para Instagram
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

`npm run build` es el único paso necesario para publicar: limpia lo copiado, construye los juegos `svelte` con `publicar: true`, copia los `estatico`, inyecta la analítica y los botones de atrás y compartir, y verifica cada artefacto.

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

`preview` permite revisar el HTML y los ficheros que genera el ensamblado. No emula las reglas de Vercel: después de desplegar, comprobar también las rutas con y sin barra final.

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

Añadir la captura `designs/og/<slug>.png` (1200 × 630) antes de publicarlo: es la imagen que declaran `og:image` y `twitter:image` y el ensamblado no arranca sin ella.

## Añadir un juego estático ya construido

1. Copiar dentro de `juegos/<slug>/` el resultado ya construido: `index.html`, CSS, JS y los assets que necesite. Con `npm run nuevo-juego -- --tipo estatico --slug <slug> --nombre "<Nombre>" --origen <ruta>` la copia descarta `package.json`, `node_modules` y los archivos ocultos.
2. **No** añadir `package.json`, ni `node_modules`, ni un paso de compilación.
3. Usar rutas absolutas `/<slug>/...` en `index.html` para los subrecursos, y relativas solo dentro del CSS. Si el juego se construyó para otro prefijo, `--prefijo-anterior <segmento>` lo reescribe.
4. Crear `juego.json` con `"tipo": "estatico"`.
5. El `index.html` debe tener `</head>` y `</body>`: antes de `</head>` se inyecta la analítica y antes de `</body>` los botones de atrás y compartir.

La plantilla mínima está en `tools/plantillas/estatico/`. La carpeta del juego es el artefacto: lo que hay en ella es lo que se sirve, salvo `juego.json`, `README.md` y los archivos ocultos.

Cada juego publica su propia imagen para `og:image` y `twitter:image`: `https://muchachadarcade.es/og/<slug>.png`. La captura vive en `designs/og/<slug>.png` (1200 × 630) y el ensamblado la copia a `apps/contenedor/static/og/`, que se sirve desde `/og/`. Si falta la captura de un juego publicado, `npm run build` falla con un mensaje que nombra el fichero. Para generarla, abre el juego a 1200 × 630, captura su pantalla inicial y guarda el resultado con ese nombre; las plantillas ya apuntan a esa ruta. La portada y el 404 siguen usando `apps/contenedor/static/splash.png` (1414 × 750), declarada en `apps/contenedor/src/routes/+page.svelte`.

## Volver a la portada

Todos los juegos llevan un botón de atrás en la esquina superior izquierda, encima del de compartir. Es un enlace a `/`, la portada del contenedor, así que funciona también cuando alguien entra directamente a un juego y no solo desde la lista. Lo inyecta el ensamblado (`tools/compartir.mjs`) junto al resto del bloque.

La portada y el 404 no lo tienen: ya son el contenedor.

## Compartir

Todas las pantallas tienen los botones de compartir en la esquina superior izquierda: el de compartir y, debajo, el de Instagram. En los juegos, encima de ellos está el de atrás. Los inyecta el ensamblado (`tools/compartir.mjs`); en la portada y el 404 los de compartir los renderiza `apps/contenedor/src/lib/Compartir.svelte` desde el layout.

### Compartir (texto)

El botón abre directamente la hoja de compartir nativa del dispositivo (`navigator.share`), la misma que ofrece WhatsApp, Instagram, Telegram y el resto de aplicaciones instaladas. No hay desplegable propio ni lista de redes.

El mensaje sigue esta plantilla, con el nombre del juego en su sitio y la URL del juego al final, como un párrafo más:

```
👾👾👾👾👾👾👾
¡¡Muchachada, llegó el faquin momento!!

💥 ¿A qué esperas para jugar a <nombre del juego> ?. Mueve el culo y pásalo a los indecisos, que el 29N está al caer. O voto útil o nos comen vivos. ¡¡A reventar encuestas, a POR ELLOS!!

<url del juego>
👾👾👾👾👾👾👾
```

La URL va dentro del texto y no se pasa además en el campo `url` de `navigator.share`: así WhatsApp y Telegram no la añaden dos veces.

El enlace compartido lleva parámetros de campaña para saber de dónde llega la visita: `utm_source=compartir`, `utm_medium=social` y `utm_campaign=29n`. El botón de Instagram usa `utm_source=instagram`.

### Longitud del mensaje

El mensaje mide entre 270 y 300 caracteres, contando emojis y URL. Cabe de sobra en los destinos que importan; solo recortarían los canales de límite corto, que no son el objetivo:

| Canal | Límite | Resultado |
| --- | --- | --- |
| Web Share API (`navigator.share`) | Sin límite propio de texto; Chromium solo limita los ficheros compartidos | Cabe |
| WhatsApp | Muy por encima del mensaje: los textos admiten decenas de miles de caracteres | Cabe |
| Telegram | 4.096 caracteres por mensaje | Cabe |
| Instagram | No admite texto predefinido: se comparte la historia con el mensaje incrustado | Se publica como imagen |
| SMS (si aparece en la hoja) | 160 caracteres por segmento (70 con emojis o acentos) | Se parte en varios SMS |
| X/Twitter | 280 caracteres | Recorta |

Si el navegador no implementa `navigator.share` (por ejemplo, Firefox de escritorio), el botón copia ese texto al portapapeles y lo avisa con un mensaje breve junto al botón.

### Instagram

Instagram no acepta texto predefinido por ninguna vía: si solo recibe texto, la app únicamente ofrece **Direct** (mensaje privado). Por eso el botón de Instagram comparte una **imagen de historia 1080 × 1920** con el mensaje incrustado, servida desde `/historias/<slug>.png`.

- La captura vive en `designs/historias/<slug>.png` (y `portada.png` para la portada y el 404). El ensamblado la copia a `static/historias/` y falla si falta la de algún juego publicado.
- El botón solo aparece si el navegador puede compartir ficheros (`navigator.canShare({ files })`: Chrome Android y Safari iOS). En escritorio no se muestra, porque la web de Instagram no publica historias.
- La imagen se descarga al cargar la página y se guarda como `File`, porque `navigator.share()` exige activación transitoria y no admite un `fetch` entre el clic y la llamada.
- En el editor de Instagram el usuario elige Historia o Publicación. El texto ya va en la imagen porque Instagram no rellena el pie de foto.
- Al pulsar el botón se copia la **URL del juego** al portapapeles y se avisa de que se puede pegar en el **sticker de enlace** de la historia. Instagram no permite adjuntar enlaces de forma programática: el enlace escrito en la imagen no es clicable; el único enlace clicable es ese sticker, que añade el usuario. La URL copiada lleva `utm_source=instagram`, `utm_medium=social` y `utm_campaign=29n`.

## Despliegue

El proyecto de Vercel debe usar **la raíz del repositorio**, no `apps/contenedor`, como Root Directory. Configuración en Settings → Build and Deployment:

| Ajuste | Valor |
| --- | --- |
| Root Directory | Raíz del repositorio (dejar vacío) |
| Framework Preset | Other |
| Install Command | `npm ci` (definido en `vercel.json`) |
| Build Command | `npm run build` (definido en `vercel.json`) |
| Output Directory | Sin override; se usa la Build Output API de `.vercel/output` |
| Node.js Version | 22.x o una versión compatible con las dependencias |

El `vercel.json` de la raíz evita que se construya únicamente el contenedor. El ensamblado construye/copia los juegos, construye el contenedor, verifica los juegos en el artefacto final y copia la salida completa del adapter desde `apps/contenedor/.vercel/output` a `.vercel/output`. Se conservan los assets, las funciones y las reglas del adapter.

Para cada juego publicado se añade una regla que sirve `/<slug>/index.html` tanto desde `/<slug>` como desde `/<slug>/`, antes de la función de reserva de SvelteKit. Los enlaces de la portada cargan un documento completo porque los juegos son aplicaciones independientes.

Si el despliegue actual solo muestra el contenedor, corregir estos ajustes y crear un nuevo despliegue. Construir solo `apps/contenedor` omite el ensamblado: las carpetas de juegos en `static/` son generadas y no están en git.

Comprobar en la URL desplegada `/` y cada juego (`/quiz-bienestar/`, `/el-pueblo-vs-fachalecos/`, `/rompe-el-fachamuro/`, `/tasa-a-los-ricos/`, `/trivial-del-frente/` y `/voto-util/`), también sin barra final y recargando cada juego directamente. Una ruta inexistente debe seguir devolviendo 404.

- La analítica sin cookies se inyecta en el paso de ensamblado y usa `/_vercel/insights/script.js`, que sólo existe si Vercel Web Analytics está activado en el proyecto.
- La lista y el 404 se prerenderizan; las rutas no encontradas las atiende la función de reserva del adapter.

### Google Analytics

Las visitas se miden con Google Analytics 4, flujo web con ID **`G-TP80CWS52D`** (definido en `tools/analitica.mjs` y en `apps/contenedor/src/app.html`).

- **Portada:** el snippet va en `apps/contenedor/src/app.html`, así que se carga en todas las páginas del contenedor, incluida la de error.
- **Juegos:** el ensamblado lo inyecta, junto a la analítica de Vercel, antes de `</head>` de cada juego. Por eso los juegos deben conservar `</head>`.
- **Separación por juego:** no hay que configurar nada más. GA4 registra la ruta de cada visita: `/` es la portada y `/<slug>/` es `voto-util`, `tasa-a-los-ricos`, etc.
- **Desarrollo:** en `localhost`, `127.0.0.1` y `[::1]` el snippet no hace nada, así que las pruebas locales no ensucian las estadísticas.
- **Consultas:** en GA4, *Informes → Compromiso → Páginas y pantallas*, con la dimensión *Ruta de la página*. El flujo web debe apuntar a `https://muchachadarcade.es`.
- GA4 instala sus cookies propias (`_ga` y `_ga_<ID>`) en el navegador del visitante; el aviso de cookies del sitio debe mencionarlo. La analítica de Vercel que ya existía sigue funcionando en paralelo y no usa cookies.

### Evento de compartir

Los dos botones de compartir emiten el evento `boton_compartir_interno` en GA4:

| Parámetro | Valores | Cuándo |
| --- | --- | --- |
| `metodo` | `nativo` | Botón principal con hoja nativa |
| `metodo` | `portapapeles` | Botón principal sin Web Share: copia el texto |
| `metodo` | `instagram` | Botón de Instagram |
| `juego` | Nombre del juego, o `FrenteAmplio` en la portada y el 404 | Siempre |

Se emite desde el widget inyectado en los juegos y desde `Compartir.svelte` en el contenedor. Si `gtag` no existe (desarrollo, `localhost`), no se envía nada.

### Evento de atrás

El botón de atrás de los juegos emite el evento `boton_atras_portada` en GA4:

| Parámetro | Valores | Cuándo |
| --- | --- | --- |
| `juego` | Nombre del juego | Siempre |
| `ruta` | Ruta del juego, por ejemplo `/voto-util/` | Siempre |

Se envía por beacon (`transport_type: 'beacon'`), así que el evento sale aunque la página se descargue al navegar a la portada. Se emite desde el widget inyectado en los juegos; si `gtag` no existe (desarrollo, `localhost`), no se envía nada y el enlace navega igual. Para usarlo en informes, registra `juego` y `ruta` como dimensiones personalizadas de ámbito *Evento* (GA4 → Admin → Definiciones personalizadas).

### Eventos del quiz-bienestar

El quiz emite eventos propios (definidos en `juegos/quiz-bienestar/src/lib/analitica.ts`) además del `page_view` inicial. Los nombres son estables: los embudos de GA4 se construyen con ellos, así que no deben renombrarse sin actualizar esta tabla. En desarrollo y en las pruebas no se emite nada, porque `gtag` no existe.

| Evento | Cuándo se emite | Parámetros |
| --- | --- | --- |
| `partida_iniciada` | Al pulsar «Empezar» en la intro | `origen` (`intro`) |
| `partida_retomada` | Al abrir el juego con progreso guardado y caer en el mapa | `villano_activo` (0–2), `respuestas` |
| `batalla_iniciada` | Al entrar en una batalla desde el mapa | `villano_id` (0–2), `villano`, `pregunta_id`, `comodin` |
| `respuesta_enviada` | Con cada respuesta del jugador | `villano_id`, `pregunta_id`, `temas` (por ejemplo `casa+moneda`), `comodin`, `efecto` (−2…2), `valoracion` (`acierto`/`neutro`/`fallo`), `numero` (1…n dentro de la batalla), `energia_jugador`, `energia_villano` |
| `batalla_terminada` | Al resolverse la batalla (energía a cero o tiempo agotado) | `villano_id`, `resultado` (`victoria`/`perfect`/`derrota`/`empate`), `ganada` (`true`/`false`), `motivo` (`energia`/`tiempo`), `respuestas`, `duracion_s`, `completada`, `energia_jugador`, `energia_villano` |
| `partida_completada` | Solo al ganar la batalla del tercer villano | `villano_id` (2), `resultado` |
| `mapa_abierto` | Al volver del resultado al mapa | `villano_activo` |
| `final_visto` | Al pulsar «Ver el final» | `villano_activo` (3) |
| `partida_reiniciada` | Al pulsar «Volver a jugar» en el final | — |

`villano_id` es el villano con el que se pelea: 0 es el primero, 1 el segundo y 2 el tercero.

**Antes de desplegar** hay que registrar como dimensiones personalizadas de ámbito *Evento* (GA4 → Admin → Definiciones personalizadas) los parámetros que se vayan a usar en informes o embudos: `villano_id`, `villano`, `resultado`, `valoracion`, `ganada`, `motivo`, `numero`, `efecto`, `temas` y `completada`. GA4 no aplica las definiciones personalizadas a los datos ya recogidos.

### Embudos (tunnels) propuestos

Se crean en GA4 → *Explorar* → *Exploración de embudo*. En todos los casos el primer paso es la vista de página del juego: condición *Ruta de la página* **contiene** `/quiz-bienestar` (no uses igualdad: la ruta puede llegar con y sin barra final).

**A. Llegada y arranque — ¿la intro convence?**

1. Vista de página `/quiz-bienestar`
2. `partida_iniciada`
3. `batalla_iniciada`
4. `respuesta_enviada`
5. `batalla_terminada` con `ganada` = `true`
6. `partida_completada`
7. `final_visto`

**B. Progresión por villano — ¿dónde se atasca la gente?**

1. `batalla_iniciada` con `villano_id` = `0`
2. `batalla_terminada` con `villano_id` = `0` y `ganada` = `true`
3. `batalla_iniciada` con `villano_id` = `1`
4. `batalla_terminada` con `villano_id` = `1` y `ganada` = `true`
5. `batalla_iniciada` con `villano_id` = `2`
6. `batalla_terminada` con `villano_id` = `2` y `ganada` = `true`

**C. Aguante dentro de una batalla — ¿cuánta gente llega a la quinta respuesta?**

1. `respuesta_enviada` con `numero` = `1` y `villano_id` = `0`
2. `respuesta_enviada` con `numero` = `2` y `villano_id` = `0`
3. `respuesta_enviada` con `numero` = `3` y `villano_id` = `0`
4. `respuesta_enviada` con `numero` = `4` y `villano_id` = `0`
5. `respuesta_enviada` con `numero` = `5` y `villano_id` = `0`

**D. Retorno — jugadores que vuelven con partida guardada**

1. `partida_retomada`
2. `batalla_iniciada`
3. `batalla_terminada` con `ganada` = `true`

**E. Después del final — ¿se reengancha?**

1. `final_visto`
2. `partida_reiniciada`

Notas para montarlos:

- Quien retoma una partida guardada no pasa por `partida_iniciada`: en el embudo A cuenta como abandono en el paso 2. O se analiza aparte con el embudo D, o se excluye ese tráfico con un segmento que no contenga `partida_retomada`.
- Los embudos de GA4 no admiten «o» entre valores: para aceptar `victoria` y `perfect` en un mismo paso, filtra por `ganada` en lugar de por `resultado`.
- `duracion_s` se pega a 120 (`duracionBatallaMs`) cuando `motivo` es `tiempo`: si ese porcentaje crece, la gente se queda sin reloj antes de terminar.
- Si un paso del embudo cae mucho respecto al anterior, el evento siguiente es el sitio donde mirar: por ejemplo, mucha `batalla_iniciada` y poca `respuesta_enviada` apunta a una pantalla de batalla que no se entiende.

### Dominio y DNS

El sitio se publica en **muchachadarcade.es** (apex) desde el proyecto de Vercel. Configuración verificada:

| Registro | Nombre | Valor |
| --- | --- | --- |
| A | `muchachadarcade.es` | `216.198.79.1` (IP anycast de Vercel) |
| NS | delegación en `.es` | `ns1`–`ns5` de cdmon |

- El certificado TLS lo emite Vercel para el apex. No hace falta ningún ajuste en el código ni en SvelteKit (`base`, `paths` u `origin` se quedan por defecto): las rutas se generan relativas al directorio de cada página, así que el mismo build funciona en `localhost`, en el dominio de preview y en el dominio final.

La URL pública es **solo el apex**; `www` queda como redirección para quien lo teclee de memoria. Hoy `www.muchachadarcade.es` no existe (NXDOMAIN), así que hay que configurarlo en dos sitios, ninguno de ellos el código:

1. **Vercel** → Project → Settings → Domains → *Add* `www.muchachadarcade.es` y elegir **Redirect to another domain** → `muchachadarcade.es` (308). Vercel emite el certificado de `www` automáticamente.
2. **cdmon** (zona DNS de `muchachadarcade.es`) → añadir `CNAME` con nombre `www` y valor `cname.vercel-dns.com` (TTL 3600). No hace falta `A` ni `AAAA` para `www`.

Cuando ambos pasos estén hechos, `https://www.muchachadarcade.es` responde `308` hacia el apex y el apex sigue sirviendo el sitio. Verificación:

```bash
dig +short www.muchachadarcade.es CNAME    # cname.vercel-dns.com.
curl -sI https://www.muchachadarcade.es    # HTTP/2 308, location: https://muchachadarcade.es/
```

Comprobación rápida desde cualquier red:

```bash
dig +short muchachadarcade.es A        # 216.198.79.1
curl -I https://muchachadarcade.es     # HTTP/2 200
```

Si un equipo concreto no resuelve el dominio pero sí el resto de internet (SERVFAIL en su resolver), el problema está en el DNS de esa red —filtros corporativos, bloqueo de dominios de nueva creación o caché negativa— y no en el despliegue; se contrasta con `dig @1.1.1.1 muchachadarcade.es`.

## Notas de mantenimiento

- Todo el monorepo usa una sola versión de Vite, la 8.3.8: es la que exigen SvelteKit 3 y el adaptador de Vercel que despliega el contenedor. `@sveltejs/vite-plugin-svelte` va emparejado en su versión 7, porque la 5 solo acepta Vite 6. Al subir Vite hay que cambiar la versión en los tres `package.json` a la vez: contenedor, juego y plantilla.
- Node 22.17 o superior: es el mínimo de SvelteKit 3 y de Vitest 5.
- `apps/contenedor/static/<slug>/` es salida generada: se ignora en git y la recrea cada `npm run build`.
- Los juegos `estatico` no son workspaces de npm; no tienen `package.json` ni scripts propios. Se sirven y se copian desde los scripts de `tools/`.
