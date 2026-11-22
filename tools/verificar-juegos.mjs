import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerManifiestos } from './manifiestos.mjs';
import { verificarJuego } from './verificar-juego.mjs';

// Verifica todos los juegos del monorepo, publicados o no. Es la puerta que
// `publicar` no puede desactivar: un juego oculto se sigue comprobando.
const manifiestos = leerManifiestos();
const problemas = [];
const pendientes = [];

for (const juego of manifiestos) {
	const distDir = juego.tipo === 'svelte' ? join(juego.directorio, 'dist') : juego.directorio;

	if (juego.tipo === 'svelte' && !existsSync(join(distDir, 'index.html'))) {
		pendientes.push(juego.slug);
		continue;
	}

	problemas.push(...verificarJuego({ slug: juego.slug, distDir, assets: juego.assets }));
}

if (problemas.length > 0) {
	console.error('✖ La verificación de los juegos ha fallado:\n');
	for (const problema of problemas) console.error(`  - ${problema}`);
	process.exit(1);
}

for (const juego of manifiestos) {
	if (!pendientes.includes(juego.slug)) console.log(`✔ ${juego.slug}`);
}

for (const slug of pendientes) {
	console.log(`– ${slug}: sin dist/, se verifica después de npm run build`);
}
