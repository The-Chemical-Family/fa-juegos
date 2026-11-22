import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { leerManifiestos } from './manifiestos.mjs';
import { verificarJuego } from './verificar-juego.mjs';

const INICIO = '<!-- analitica:start -->';
const FIN = '<!-- analitica:end -->';
const SNIPPET = '<script defer src="/_vercel/insights/script.js"></script>';
const NO_SE_SIRVEN = new Set(['juego.json', 'README.md', 'dist', 'node_modules']);

const raiz = process.cwd();
const contenedor = join(raiz, 'apps', 'contenedor');
const estatico = join(contenedor, 'static');

const manifiestos = leerManifiestos(raiz);
const publicados = manifiestos.filter((juego) => juego.publicar);
const ocultos = manifiestos.filter((juego) => !juego.publicar);

limpiarPublicados();

for (const juego of publicados) {
	const destino = join(estatico, juego.slug);

	if (juego.tipo === 'svelte') {
		console.log(`\n▶ ${juego.slug}: construyendo`);
		ejecutar('npm', ['run', 'build', '-w', join('juegos', juego.slug)]);

		const origen = join(juego.directorio, 'dist');
		if (!existsSync(join(origen, 'index.html'))) {
			throw new Error(`${juego.slug}: el build no ha generado dist/index.html`);
		}

		cpSync(origen, destino, { recursive: true });
	} else {
		// Juego estático ya construido: la carpeta del juego es el artefacto. Se
		// copia tal cual y solo se deja fuera lo que no debe servirse.
		console.log(`\n▶ ${juego.slug}: copiando (sin build)`);
		copiarEstatico(juego.directorio, destino);
	}

	inyectarAnalitica(join(destino, 'index.html'));
}

const problemas = publicados.flatMap((juego) =>
	verificarJuego({
		slug: juego.slug,
		distDir: join(estatico, juego.slug),
		assets: juego.assets
	})
);

if (problemas.length > 0) {
	console.error('\n✖ La verificación ha fallado:\n');
	for (const problema of problemas) console.error(`  - ${problema}`);
	process.exit(1);
}

console.log('\n▶ contenedor: construyendo');
ejecutar('npm', ['run', 'build', '-w', 'apps/contenedor']);

console.log('\n✔ Ensamblado terminado');
for (const juego of publicados) console.log(`  publicado: /${juego.slug}/ — ${juego.nombre}`);
for (const juego of ocultos) console.log(`  oculto:    ${juego.slug} (publicar: false)`);

function copiarEstatico(origen, destino) {
	cpSync(origen, destino, {
		recursive: true,
		filter: (ruta) => {
			const partes = ruta.slice(origen.length).split(/[/\\]+/).filter(Boolean);
			return partes.every((parte) => !NO_SE_SIRVEN.has(parte) && !parte.startsWith('.'));
		}
	});
}

function limpiarPublicados() {
	if (!existsSync(estatico)) return;
	for (const entrada of readdirSync(estatico, { withFileTypes: true })) {
		if (entrada.isDirectory()) rmSync(join(estatico, entrada.name), { recursive: true, force: true });
	}
}

function inyectarAnalitica(ruta) {
	const html = readFileSync(ruta, 'utf8');
	const limpio = quitarBloque(html);

	if (!/<\/head>/i.test(limpio)) {
		throw new Error(`${ruta}: no hay </head> donde inyectar la analítica`);
	}

	const conSnippet = limpio.replace(/<\/head>/i, `${INICIO}${SNIPPET}${FIN}\n</head>`);

	if (conSnippet.split(SNIPPET).length - 1 !== 1) {
		throw new Error(`${ruta}: la analítica se ha inyectado más de una vez`);
	}

	writeFileSync(ruta, conSnippet);
}

function quitarBloque(html) {
	let resultado = html;
	let inicio = resultado.indexOf(INICIO);

	while (inicio !== -1) {
		const fin = resultado.indexOf(FIN, inicio);
		if (fin === -1) break;
		resultado = resultado.slice(0, inicio) + resultado.slice(fin + FIN.length);
		inicio = resultado.indexOf(INICIO);
	}

	return resultado;
}

function ejecutar(comando, argumentos) {
	execFileSync(comando, argumentos, { cwd: raiz, stdio: 'inherit' });
}
