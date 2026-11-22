# Desenmascara · Voto útil 29N

Juego web estático: eliges la web de PP o de VOX, la derribas a mazazos y debajo aparece
"TAX THE RICH · VOTO ÚTIL 29N · VOTA FRENTE AMPLIO". Al terminar, el juego genera un GIF
con tu partida para compartirlo por WhatsApp.

No necesita servidor, base de datos ni dependencias externas.

## Archivos

- `index.html`: la página
- `css/estilos.css`: estilos
- `js/juego.js`: lógica del juego, sonidos (generados en el navegador) y creador del GIF

## Tipo de juego

Es un juego **estático ya construido**: HTML, CSS y JS sin herramienta de compilación. No tiene
`package.json`; el monorepo copia la carpeta tal cual.

## Publicar

Se sirve en `https://juegoamplista.es/desenmascara/`. El ensamblado copia la carpeta a
`apps/contenedor/static/desenmascara/`; no se sube la carpeta a mano a ningún sitio.

```bash
npm run build   # ensambla el sitio completo y verifica el juego
```

## Probar en local

```bash
npm install       # desde la raíz del monorepo
npm run dev:todo  # http://localhost:5173/desenmascara/
```

No hay compilación: edita los archivos y recarga.

Las rutas de `css/` y `js/` son absolutas (`/desenmascara/...`) para que el juego funcione también
en la URL sin barra final.

Necesita **https**: el botón "Compartir mi GIF" del móvil usa la función de compartir
del navegador, que solo funciona en páginas seguras. Si no está disponible, el GIF se descarga.

## Cambiar textos

- Mensajes del 15 %, 50 %, 75 % y 100 %: función `checkMilestones` y `finish` en `js/juego.js`
- Texto que se comparte por WhatsApp: función `shareText` en `js/juego.js`
- Eslóganes de las webs de parodia: objeto `THEMES` al principio de `js/juego.js`
- Dificultad: `CHARGE` (tiempo de carga de la maza), `strikeRadius` y el tamaño de bloque `B` en `layout()`
