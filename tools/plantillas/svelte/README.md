# __NOMBRE__

Juego web construido con Svelte 5, Vite 8 y TypeScript (`"tipo": "svelte"` en `juego.json`). Se
sirve en `/__SLUG__/` del sitio.

## Comandos

```bash
npm run dev     # servidor de desarrollo con recarga
npm run build   # genera dist/
npm run check   # svelte-check, sin errores ni avisos
```

## Dónde va cada cosa

- `src/App.svelte`: pantalla única. A partir de aquí crece el juego.
- `src/app.css`: estilos globales mínimos.
- `src/main.ts`: monta la aplicación en `#app`.
- `vite.config.ts`: `base` fijado a `/__SLUG__/`. No lo cambies: el ensamblado sirve el juego bajo esa ruta.

## Archivos que se cargan en tiempo de ejecución

Si el juego carga un vídeo, audio o imagen desde JavaScript, crea `static/` y añade
`publicDir: 'static'` a `vite.config.ts`. Declara cada archivo en `assets` de
`juego.json` para que la verificación compruebe que llega a `dist/`.
