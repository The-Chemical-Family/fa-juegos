import { spawn } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { leerManifiestos } from './manifiestos.mjs';

// Levanta el contenedor y todos los juegos publicados. No conoce ningún nombre:
// los descubre en los manifiestos y elige puertos a partir del 5174.
const PUERTO_CONTENEDOR = 5173;
const PRIMER_PUERTO_JUEGO = 5174;
const ARCHIVO_PROXY = join('apps', 'contenedor', '.juegos-dev.json');

const hijos = [];
let cerrando = false;

for (const senal of ['SIGINT', 'SIGTERM']) process.on(senal, () => cerrar(0));

const publicados = leerManifiestos().filter((juego) => juego.publicar);
const puertos = publicados.map((_, indice) => PRIMER_PUERTO_JUEGO + indice);

const objetivos = [
	['contenedor', PUERTO_CONTENEDOR],
	...publicados.map((juego, indice) => [juego.slug, puertos[indice]])
];

for (const [nombre, puerto] of objetivos) {
	if (!(await puertoLibre(puerto))) {
		console.error(`✖ El puerto ${puerto} (${nombre}) está ocupado. Para el proceso que lo usa y vuelve a intentarlo.`);
		process.exit(1);
	}
}

console.log('▶ construyendo el sitio (necesario para que la lista tenga enlaces)\n');
await ejecutar(['run', 'build']);

console.log('\n▶ arrancando los procesos\n');

const proxy = {};

publicados.forEach((juego, indice) => {
	const puerto = puertos[indice];
	const paquete = JSON.parse(readFileSync(join(juego.directorio, 'package.json'), 'utf8'));
	const scripts = paquete.scripts ?? {};

	if (scripts.dev) {
		// Servidor de desarrollo con recarga en caliente; se asume base `/<slug>/`.
		proxy[juego.slug] = { puerto, quitarPrefijo: false };
		lanzar(juego.slug, [
			'run',
			'dev',
			'-w',
			`juegos/${juego.slug}`,
			'--',
			'--port',
			String(puerto),
			'--strictPort'
		]);
	} else if (scripts.serve) {
		// Build estático servido en la raíz del puerto: hay que quitar el prefijo.
		proxy[juego.slug] = { puerto, quitarPrefijo: true };
		lanzar(juego.slug, ['run', 'serve', '-w', `juegos/${juego.slug}`, '--', String(puerto)]);
	} else {
		console.warn(`⚠ ${juego.slug} no tiene script "dev" ni "serve": se servirá la copia construida.`);
	}
});

writeFileSync(ARCHIVO_PROXY, JSON.stringify(proxy, null, 2));

lanzar('contenedor', ['run', 'dev', '-w', 'apps/contenedor', '--', '--port', String(PUERTO_CONTENEDOR), '--strictPort'], {
	PROXY_JUEGOS: '1'
});

console.log(`\n  contenedor  http://localhost:${PUERTO_CONTENEDOR}/`);
for (const [slug, datos] of Object.entries(proxy)) {
	const nota = datos.quitarPrefijo ? 'build estático, sin recarga' : 'recarga en caliente';
	console.log(`  ${slug.padEnd(13)} http://localhost:${datos.puerto}/${slug}/  (${nota})`);
}
console.log('\n  Ctrl-C para parar todo\n');

const sinRecarga = Object.entries(proxy).filter(([, datos]) => datos.quitarPrefijo);
if (sinRecarga.length > 0) {
	console.log(`  Para ver cambios en ${sinRecarga.map(([slug]) => slug).join(', ')}:`);
	for (const [slug] of sinRecarga) console.log(`    npm run build -w juegos/${slug}`);
	console.log('');
}

function lanzar(nombre, argumentos, entorno = {}) {
	const hijo = spawn('npm', argumentos, { stdio: 'inherit', env: { ...process.env, ...entorno } });

	hijo.on('exit', (codigo) => {
		if (cerrando || codigo === 0) return;
		console.error(`\n✖ ${nombre} ha terminado con código ${codigo}`);
		cerrar(codigo);
	});

	hijos.push(hijo);
	return hijo;
}

function puertoLibre(puerto) {
	return new Promise((resolver) => {
		const sonda = createServer();
		sonda.once('error', () => resolver(false));
		sonda.once('listening', () => sonda.close(() => resolver(true)));
		sonda.listen(puerto, '127.0.0.1');
	});
}

function ejecutar(argumentos) {
	return new Promise((resolver, rechazar) => {
		const hijo = spawn('npm', argumentos, { stdio: 'inherit' });
		hijo.on('exit', (codigo) => (codigo === 0 ? resolver() : rechazar(new Error(`npm ${argumentos.join(' ')} falló`))));
	});
}

function cerrar(codigo) {
	if (cerrando) return;
	cerrando = true;
	if (existsSync(ARCHIVO_PROXY)) rmSync(ARCHIVO_PROXY, { force: true });
	for (const hijo of hijos) {
		try {
			hijo.kill('SIGTERM');
		} catch {
			// ya estaba parado
		}
	}
	process.exit(codigo);
}
