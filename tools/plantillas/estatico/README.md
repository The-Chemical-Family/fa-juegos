# __NOMBRE__

Juego web ya construido: HTML, CSS y JS sin herramienta de compilación. Se sirve en
`/__SLUG__/` del sitio y el monorepo lo copia tal cual.

## Reglas del tipo `estatico`

- **Sin `package.json`** y sin `node_modules`: nada que compilar.
- Rutas absolutas `/<slug>/...` en `index.html`; relativas solo dentro del CSS.
- El `index.html` debe tener `</head>`: ahí se inyecta la analítica.
- Los recursos que solo carga el JavaScript se declaran en `assets` de `juego.json`.

## Comandos

```bash
npm run dev:todo   # http://localhost:5173/__SLUG__/
npm run build      # ensambla el sitio y verifica el juego
```
