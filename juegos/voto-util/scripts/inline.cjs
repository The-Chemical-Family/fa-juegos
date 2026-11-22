// Genera dist/index.html autocontenido (un único archivo, sin dependencias externas)
const fs = require("fs");
const js = fs.readFileSync("build/app.js", "utf8").replace(/<\/script/g, "<\\/script");
const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Voto útil</title><style>html,body,#root{margin:0;height:100%}</style></head><body><div id="root"></div><script>
${js}
</script></body></html>
`;
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);
console.log("dist/index.html generado (" + Math.round(html.length / 1024) + " KB)");
