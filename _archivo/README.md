# Archivo

Código que se conserva por su valor histórico pero **no forma parte del monorepo publicado**.
No está en los workspaces, no lo lee ningún script y no se despliega.

## voto-util-react

Fuente del juego *Voto útil* escrita en React 18 y empaquetada con esbuild. El monorepo solo
admite dos tipos de juego —aplicación Svelte o juego estático ya construido—, así que esta
versión quedó fuera del modelo.

El juego publicado vive en `juegos/voto-util/` como `index.html` ya construido, generado a
partir de este código.
