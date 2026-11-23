// Botón de "compartir" de los juegos. El contenedor tiene su propio componente
// (`apps/contenedor/src/lib/Compartir.svelte`), pero los juegos son documentos
// independientes: el ensamblado inyecta este bloque antes de `</body>`, igual
// que la analítica se inyecta antes de `</head>`.
//
// Pulsar el botón abre la hoja de compartir nativa del dispositivo
// (`navigator.share`), que es la que ofrece WhatsApp, Instagram, Telegram y el
// resto de aplicaciones instaladas. Si el navegador no la implementa, se copia
// el texto al portapapeles y se avisa con un mensaje breve.
//
// Todo va en línea (estilos, icono y script) para que el bloque no dependa de
// ningún fichero servido: así `verificarJuego` lo ve autocontenido y los juegos
// siguen siendo carpeta + index.html.
export const INICIO = '<!-- compartir:start -->';
export const FIN = '<!-- compartir:end -->';

// Plantilla del mensaje; debe coincidir con `Compartir.svelte`. El resultado:
//
//   👾👾👾👾👾👾👾
//   ¡¡Muchachada, llegó el faquin momento!!
//
//   💥 ¿A qué esperas para jugar a <nombre> ?. Mueve el culo …
//
//   <url del juego>
//   👾👾👾👾👾👾👾
const APERTURA = '👾👾👾👾👾👾👾';
const PRIMERA = '¡¡Muchachada, llegó el faquin momento!!';
const ANTES = '💥 ¿A qué esperas para jugar a ';
const DESPUES =
	' ?. Mueve el culo y pásalo a los indecisos, que el 29N está al caer. O voto útil o nos comen vivos. ¡¡A reventar encuestas, a POR ELLOS!!';
const CIERRE = '👾👾👾👾👾👾👾';

export function bloqueCompartir(nombre) {
	// Los datos van en un JSON que es también un literal de JavaScript válido.
	// `<` se escapa para que un nombre con `</script>` no cierre la etiqueta.
	const datos = JSON.stringify({
		apertura: APERTURA,
		primera: PRIMERA,
		antes: ANTES,
		despues: DESPUES,
		cierre: CIERRE,
		nombre
	}).replace(
		/</g,
		'\\u003c'
	);

	return `${INICIO}
<style>
#fa-compartir{position:fixed;top:calc(10px + env(safe-area-inset-top, 0px));left:calc(10px + env(safe-area-inset-left, 0px));z-index:2147483647;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.3;color:#fff;text-align:left;-webkit-text-size-adjust:100%}
#fa-compartir *{box-sizing:border-box}
#fa-compartir .fa-compartir__boton{display:flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:0;min-height:0;margin:0;padding:0;font:inherit;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(16,9,12,.75);color:#fff;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 4px 14px rgba(0,0,0,.35)}
#fa-compartir .fa-compartir__boton:hover{background:rgba(16,9,12,.92)}
#fa-compartir .fa-compartir__boton:focus-visible{outline:2px solid #cce876;outline-offset:2px}
#fa-compartir .fa-compartir__aviso{position:absolute;top:52px;left:0;width:max-content;max-width:min(272px,calc(100vw - 20px));margin:0;padding:8px 10px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:#160d11;font-size:13px;font-weight:600;color:#cce876;box-shadow:0 10px 26px rgba(0,0,0,.45)}
#fa-compartir .fa-compartir__aviso[hidden]{display:none}
</style>
<div id="fa-compartir">
<button type="button" class="fa-compartir__boton" title="Compartir" aria-label="Compartir este juego"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
<p class="fa-compartir__aviso" role="status" hidden></p>
</div>
<script>
(function(){
var datos=${datos};
var raiz=document.getElementById('fa-compartir');
if(!raiz)return;
var boton=raiz.querySelector('.fa-compartir__boton');
var aviso=raiz.querySelector('.fa-compartir__aviso');
var temporizador;

function direccion(){return location.origin+location.pathname}
function texto(){return datos.apertura+'\\n'+datos.primera+'\\n\\n'+datos.antes+datos.nombre+datos.despues+'\\n\\n'+direccion()+'\\n'+datos.cierre}

function avisar(mensaje){
	aviso.textContent=mensaje;
	aviso.hidden=false;
	clearTimeout(temporizador);
	temporizador=setTimeout(function(){aviso.hidden=true},5000);
}

function copiarAntiguo(contenido){
	var campo=document.createElement('textarea');
	campo.value=contenido;
	campo.setAttribute('readonly','');
	campo.style.position='fixed';
	campo.style.top='0';
	campo.style.opacity='0';
	document.body.appendChild(campo);
	campo.select();
	var copiado=false;
	try{copiado=document.execCommand('copy')}catch(error){}
	document.body.removeChild(campo);
	return copiado;
}

function copiarTexto(){
	var contenido=texto();
	if(navigator.clipboard&&navigator.clipboard.writeText){
		return navigator.clipboard.writeText(contenido).then(function(){return true},function(){return copiarAntiguo(contenido)});
	}
	return Promise.resolve(copiarAntiguo(contenido));
}

boton.addEventListener('click',function(){
	if(typeof navigator.share==='function'){
		navigator.share({title:datos.nombre,text:texto()}).catch(function(){});
		return;
	}
	copiarTexto().then(function(ok){
		avisar(ok?'Texto copiado: pégalo donde quieras compartirlo.':'No se ha podido compartir este juego.');
	});
});
})();
</script>
${FIN}`;
}
