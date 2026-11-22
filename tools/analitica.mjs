// Google Analytics 4. El ID identifica el flujo web del sitio; las visitas se
// separan solas por ruta: `/` es la portada y `/<slug>/` cada juego.
export const ID_ANALITICA_GA = 'G-TP80CWS52D';

/**
 * Etiqueta de Google Analytics lista para pegar antes de `</head>`.
 *
 * Se carga desde JavaScript para no contar las visitas de desarrollo: en
 * `localhost` el snippet no hace nada. El contenedor usa el mismo criterio en
 * su `app.html`.
 */
export function snippetAnalitica(id = ID_ANALITICA_GA) {
	return [
		'<script>',
		'(function(){',
		"var h=location.hostname;",
		"if(h===''||h==='localhost'||h==='127.0.0.1'||h==='[::1]')return;",
		"var s=document.createElement('script');",
		's.async=true;',
		`s.src='https://www.googletagmanager.com/gtag/js?id=${id}';`,
		'document.head.appendChild(s);',
		'window.dataLayer=window.dataLayer||[];',
		'window.gtag=function(){window.dataLayer.push(arguments);};',
		"window.gtag('js',new Date());",
		`window.gtag('config','${id}');`,
		'})();',
		'</script>'
	].join('');
}
