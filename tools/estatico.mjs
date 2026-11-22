import { cpSync, existsSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';

// Empaqueta un juego estático sin toolchain: borra el destino y copia cada
// entrada tal cual, conservando su nombre. Uso: node tools/estatico.mjs dist index.html css js
const [destino = 'dist', ...entradas] = process.argv.slice(2);

if (entradas.length === 0) {
	console.error('Uso: node tools/estatico.mjs <destino> <entrada...>');
	process.exit(1);
}

for (const entrada of entradas) {
	if (!existsSync(entrada)) {
		console.error(`No existe "${entrada}".`);
		process.exit(1);
	}
}

rmSync(destino, { recursive: true, force: true });

for (const entrada of entradas) {
	cpSync(entrada, join(destino, basename(entrada)), { recursive: true });
}

console.log(`${destino}/ listo con: ${entradas.join(', ')}`);
