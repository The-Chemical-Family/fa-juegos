import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const TIPOS = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.mp4': 'video/mp4',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8'
};

const [directorio = 'dist', puerto = '4175'] = process.argv.slice(2);
const raiz = resolve(directorio);

if (!existsSync(raiz)) {
	console.error(`No existe ${raiz}. Construye el juego antes de servirlo.`);
	process.exit(1);
}

createServer((peticion, respuesta) => {
	const ruta = decodeURIComponent(new URL(peticion.url, 'http://localhost').pathname);
	const relativa = normalize(ruta).replace(/^(\.\.[/\\])+/, '');
	let fichero = join(raiz, relativa);

	if (existsSync(fichero) && statSync(fichero).isDirectory()) fichero = join(fichero, 'index.html');

	if (!fichero.startsWith(raiz) || !existsSync(fichero) || !statSync(fichero).isFile()) {
		respuesta.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		respuesta.end('404');
		return;
	}

	respuesta.writeHead(200, {
		'content-type': TIPOS[extname(fichero)] ?? 'application/octet-stream',
		'cache-control': 'no-store'
	});
	createReadStream(fichero).pipe(respuesta);
}).listen(Number(puerto), () => {
	console.log(`sirviendo ${raiz} en http://localhost:${puerto}`);
});
