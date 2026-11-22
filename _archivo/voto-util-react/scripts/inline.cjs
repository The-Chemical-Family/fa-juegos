// Genera dist/index.html autocontenido (un único archivo, sin dependencias externas)
const fs = require("fs");
const js = fs.readFileSync("build/app.js", "utf8").replace(/<\/script/g, "<\\/script");
const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Voto útil</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%97%B3%EF%B8%8F%3C/text%3E%3C/svg%3E"><style>html,body,#root{margin:0;height:100%}</style></head><body><div id="root"></div><script>
${js}
</script></body></html>
`;
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);
console.log("dist/index.html generado (" + Math.round(html.length / 1024) + " KB)");
