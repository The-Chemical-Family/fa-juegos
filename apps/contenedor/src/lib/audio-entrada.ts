import { browser } from '$app/env';
import audioEntrada from '#lib/assets/audio_entrada.mp3';

// El audio de entrada suena en cada carga de la portada salvo que el visitante
// lo silencie; el botón recuerda esa decisión entre visitas.
//
// Se arranca al evaluar este módulo, sin esperar a que Svelte hidrate. Los
// navegadores solo permiten audio con sonido después de una interacción, así
// que mientras no suene se reintenta con cada gesto, al volver a la pestaña y
// al restaurarse desde la caché.
const CLAVE = 'fa-audio-silenciado';
const GESTOS = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart'] as const;

let elemento: HTMLAudioElement | null = null;
let silenciado = leerSilencio();

function leerSilencio(): boolean {
	try {
		return localStorage.getItem(CLAVE) === '1';
	} catch {
		return false;
	}
}

function guardarSilencio(valor: boolean) {
	try {
		if (valor) localStorage.setItem(CLAVE, '1');
		else localStorage.removeItem(CLAVE);
	} catch {
		// Sin almacenamiento el botón funciona igual, solo no recuerda.
	}
}

function crear() {
	elemento = new Audio(audioEntrada);
	elemento.preload = 'auto';
	elemento.addEventListener('playing', dejarDeEsperar);
}

function intentar() {
	if (silenciado || !elemento || !elemento.paused) return;
	elemento.play().catch(() => {
		// Autoplay bloqueado: se reintenta con los oyentes de abajo.
	});
}

function alVolver() {
	if (document.visibilityState === 'visible') intentar();
}

function dejarDeEsperar() {
	for (const tipo of GESTOS) window.removeEventListener(tipo, intentar);
	document.removeEventListener('visibilitychange', alVolver);
	window.removeEventListener('pageshow', alVolver);
}

function esperarGesto() {
	for (const tipo of GESTOS) window.addEventListener(tipo, intentar);
	document.addEventListener('visibilitychange', alVolver);
	window.addEventListener('pageshow', alVolver);
}

function arrancar() {
	if (silenciado) return;
	if (!elemento) crear();
	intentar();
	esperarGesto();
}

export function estaSilenciado(): boolean {
	return silenciado;
}

export function alternarSilencio(): boolean {
	silenciado = !silenciado;
	guardarSilencio(silenciado);
	dejarDeEsperar();

	if (silenciado) {
		elemento?.pause();
		return silenciado;
	}

	if (!elemento) crear();
	intentar();
	esperarGesto();

	return silenciado;
}

if (browser) arrancar();
