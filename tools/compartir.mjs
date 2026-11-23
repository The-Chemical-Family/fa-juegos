// Botones de la esquina de los juegos: el de "atrás", que vuelve a la portada,
// y los de compartir. El contenedor tiene su propio componente
// (`apps/contenedor/src/lib/Compartir.svelte`) para los de compartir, pero los
// juegos son documentos independientes: el ensamblado inyecta este bloque antes
// de `</body>`, igual que la analítica se inyecta antes de `</head>`.
//
// El botón de atrás es un enlace a `/` (la portada del contenedor) y emite el
// evento `boton_atras_portada` en GA4. La navegación la hace el propio enlace:
// GA4 envía el evento por beacon, así que no se retrasa la salida del juego.
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
	' ? Mueve el culo y pásalo a los indecisos, que el 29N está al caer. O voto útil o nos comen vivos. ¡¡A reventar encuestas, a POR ELLOS!!';
const CIERRE = '👾👾👾👾👾👾👾';

export function bloqueCompartir(nombre, historia) {
	// Los datos van en un JSON que es también un literal de JavaScript válido.
	// `<` se escapa para que un nombre con `</script>` no cierre la etiqueta.
	const datos = JSON.stringify({
		apertura: APERTURA,
		primera: PRIMERA,
		antes: ANTES,
		despues: DESPUES,
		cierre: CIERRE,
		nombre,
		historia
	}).replace(
		/</g,
		'\\u003c'
	);

	return `${INICIO}
<style>
#fa-compartir{position:fixed;top:calc(10px + env(safe-area-inset-top, 0px));left:calc(10px + env(safe-area-inset-left, 0px));z-index:2147483647;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.3;color:#fff;text-align:left;-webkit-text-size-adjust:100%}
#fa-compartir *{box-sizing:border-box}
#fa-compartir .fa-compartir__acciones{display:flex;flex-direction:column;gap:8px}
#fa-compartir .fa-compartir__boton{display:flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:0;min-height:0;margin:0;padding:0;font:inherit;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(16,9,12,.75);color:#fff;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 4px 14px rgba(0,0,0,.35)}
#fa-compartir .fa-compartir__boton:hover{background:rgba(16,9,12,.92)}
#fa-compartir .fa-compartir__boton:focus-visible{outline:2px solid #cce876;outline-offset:2px}
#fa-compartir .fa-compartir__boton[hidden]{display:none}
#fa-compartir .fa-compartir__atras{text-decoration:none}
#fa-compartir .fa-compartir__instagram:disabled{cursor:progress;opacity:.55}
#fa-compartir .fa-compartir__aviso{position:absolute;top:156px;left:0;width:max-content;max-width:min(272px,calc(100vw - 20px));margin:0;padding:8px 10px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:#160d11;font-size:13px;font-weight:600;color:#cce876;box-shadow:0 10px 26px rgba(0,0,0,.45)}
#fa-compartir .fa-compartir__aviso[hidden]{display:none}
</style>
<div id="fa-compartir">
<div class="fa-compartir__acciones">
<a class="fa-compartir__boton fa-compartir__atras" href="/" title="Volver a la portada" aria-label="Volver a la portada"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></a>
<button type="button" class="fa-compartir__boton fa-compartir__compartir" title="Compartir" aria-label="Compartir este juego"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
<button type="button" class="fa-compartir__boton fa-compartir__instagram" title="Compartir en Instagram" aria-label="Compartir en Instagram" hidden><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/></svg></button>
</div>
<p class="fa-compartir__aviso" role="status" hidden></p>
</div>
<script>
(function(){
var datos=${datos};
var raiz=document.getElementById('fa-compartir');
if(!raiz)return;
var atras=raiz.querySelector('.fa-compartir__atras');
var boton=raiz.querySelector('.fa-compartir__compartir');
var instagram=raiz.querySelector('.fa-compartir__instagram');
var aviso=raiz.querySelector('.fa-compartir__aviso');
var temporizador;
var archivo=null;

function direccion(fuente){
	// Sin new URL: el verificador confunde la llamada con una ruta CSS.
	var parametros='utm_source='+encodeURIComponent(fuente)+'&utm_medium=social&utm_campaign=29n';
	return location.origin+location.pathname+'?'+parametros;
}
function texto(fuente){return datos.apertura+'\\n'+datos.primera+'\\n\\n'+datos.antes+datos.nombre+datos.despues+'\\n\\n'+direccion(fuente)+'\\n'+datos.cierre}

function registrar(metodo){
	if(typeof window.gtag!=='function')return;
	window.gtag('event','boton_compartir_interno',{metodo:metodo,juego:datos.nombre});
}

// El evento sale por beacon para que la navegación del enlace no lo cancele.
function registrarAtras(){
	if(typeof window.gtag!=='function')return;
	window.gtag('event','boton_atras_portada',{juego:datos.nombre,ruta:location.pathname,transport_type:'beacon'});
}

function avisar(mensaje,duracion){
	aviso.textContent=mensaje;
	aviso.hidden=false;
	clearTimeout(temporizador);
	temporizador=setTimeout(function(){aviso.hidden=true},duracion||5000);
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

function copiarTexto(contenido){
	if(navigator.clipboard&&navigator.clipboard.writeText){
		return navigator.clipboard.writeText(contenido).then(function(){return true},function(){return copiarAntiguo(contenido)});
	}
	return Promise.resolve(copiarAntiguo(contenido));
}

function prepararInstagram(){
	if(!navigator.canShare||typeof File!=='function')return;
	var prueba;
	try{prueba=new File([new Blob([''],{type:'image/png'})],'prueba.png',{type:'image/png'});}catch(error){return;}
	var valido=false;
	try{valido=navigator.canShare({files:[prueba]});}catch(error){valido=false;}
	if(!valido)return;
	instagram.hidden=false;
	instagram.disabled=true;
	function cargar(){
		fetch(datos.historia).then(function(respuesta){
			if(!respuesta.ok)throw new Error('sin imagen');
			return respuesta.blob();
		}).then(function(blob){
			archivo=new File([blob],datos.historia.split('/').pop(),{type:'image/png'});
			instagram.disabled=false;
		}).catch(function(){
			instagram.hidden=true;
		});
	}
	// La imagen solo se descarga cuando el navegador está libre: no retrasa el juego.
	if('requestIdleCallback' in window)requestIdleCallback(cargar,{timeout:3000});
	else setTimeout(cargar,1200);
}

instagram.addEventListener('click',function(){
	if(!archivo)return;
	registrar('instagram');
	// Instagram no admite enlaces prefijados: se copia la URL para que el
	// usuario la pegue en el sticker de enlace de la historia.
	if(navigator.clipboard&&navigator.clipboard.writeText){
		navigator.clipboard.writeText(direccion('instagram')).then(function(){
			avisar('Enlace copiado: añádelo con el sticker de enlace.',10000);
		},function(){});
	}
	navigator.share({title:datos.nombre,text:texto('instagram'),files:[archivo]}).catch(function(){});
});

boton.addEventListener('click',function(){
	if(typeof navigator.share==='function'){
		registrar('nativo');
		navigator.share({title:datos.nombre,text:texto('compartir')}).catch(function(){});
		return;
	}
	registrar('portapapeles');
	copiarTexto(texto('compartir')).then(function(ok){
		avisar(ok?'Texto copiado: pégalo donde quieras compartirlo.':'No se ha podido compartir este juego.');
	});
});

atras.addEventListener('click',registrarAtras);

prepararInstagram();
})();
</script>
${FIN}`;
}
