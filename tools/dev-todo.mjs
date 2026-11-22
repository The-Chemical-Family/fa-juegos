import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

// Levanta el contenedor y los dos juegos a la vez para revisar el sitio
// completo en local. El contenedor enruta /<slug>/ a cada juego en marcha.
const hijos = [];
let cerrando = false;

const PUERTO_CONTENEDOR = 5173;
const PUERTO_QUIZ = 5174;
const PUERTO_VOTO = 4175;

for (const [nombre, puerto] of [
	['contenedor', PUERTO_CONTENEDOR],
	['quiz-bienestar', PUERTO_QUIZ],
	['voto-util', PUERTO_VOTO]
]) {
	if (!(await puertoLibre(puerto))) {
		console.error(`✖ El puerto ${puerto} (${nombre}) está ocupado. Para el proceso que lo usa y vuelve a intentarlo.`);
		process.exit(1);
	}
}

console.log('▶ construyendo el sitio (necesario para que la lista tenga enlaces)\n');
await ejecutar(['run', 'build']);

console.log('\n▶ arrancando los procesos\n');
lanzar('quiz-bienestar', ['run', 'dev', '-w', 'juegos/quiz-bienestar', '--', '--port', String(PUERTO_QUIZ), '--strictPort']);
lanzar('voto-util', ['run', 'serve', '-w', 'juegos/voto-util', '--', String(PUERTO_VOTO)]);
lanzar('contenedor', ['run', 'dev', '-w', 'apps/contenedor', '--', '--port', String(PUERTO_CONTENEDOR), '--strictPort'], {
	PROXY_JUEGOS: '1',
	PUERTO_QUIZ: String(PUERTO_QUIZ),
	PUERTO_VOTO: String(PUERTO_VOTO)
});

console.log(`\n  contenedor  http://localhost:${PUERTO_CONTENEDOR}/`);
console.log(`  quiz        http://localhost:${PUERTO_QUIZ}/quiz-bienestar/  (recarga en caliente)`);
console.log(`  voto-util   http://localhost:${PUERTO_VOTO}/  (build estático: recompila para ver cambios)`);
console.log('\n  Ctrl-C para parar todo\n');

for (const senal of ['SIGINT', 'SIGTERM']) process.on(senal, () => cerrar(0));

function lanzar(nombre, argumentos, entorno = {}) {
	const hijo = spawn('npm', argumentos, {
		stdio: 'inherit',
		env: { ...process.env, ...entorno }
	});

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
	for (const hijo of hijos) {
		try {
			hijo.kill('SIGTERM');
		} catch {
			// ya estaba parado
		}
	}
	process.exit(codigo);
}
