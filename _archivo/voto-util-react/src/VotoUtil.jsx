import React, { useState, useEffect, useRef, useMemo } from "react";
import { T, CHAPTERS } from "./data.js";

/* ===================== ¡AQUÍ ESTÁN! · versión ROCK ===================== */
const PROGRAMA_URL = "https://frenteamplio.info/pdf/ProgramaFrenteAmplio.pdf";
const GAME_URL = "https://claude.ai/artifact/SXAnGz8cR4DAoJhoeSsn4e";
// Identidad Frente Amplio: letras lima sobre fondo bermellón
const MAL = "#e8452c", BIEN = "#1d6b45", INK = "#141414", YEL = "#c6f432";

const CH = {}; const POOL = [];
CHAPTERS.forEach((ch, ci) => ch.s.forEach(([name, chars], si) => chars.forEach(([e, n, cat, quote, vive, topic], k) => { const id = `${ci}.${si}.${k}`; CH[id] = { id, n, cat, topic }; POOL.push(id); })));
const SIDE = (id) => (["pueblo", "aliado"].includes(CH[id].cat) ? "bien" : "mal");

const SLOGAN = {
  viv_parque: "1,5 MILLONES DE CASAS PÚBLICAS", viv_espec: "CASAS PARA VIVIR, NO PARA ESPECULAR", viv_turis: "TU BARRIO NO ES UN AIRBNB", viv_alq: "ALQUILER AL 25 % DE TU SUELDO",
  viv_desah: "NI UN DESAHUCIO MÁS", viv_rehab: "CASAS FRESCAS, FACTURAS BAJAS", viv_47: "LA VIVIENDA, UN DERECHO DE VERDAD", trab_32: "32 HORAS. MISMO SUELDO.",
  trab_smi: "SALARIO MÍNIMO BLINDADO AL 60 %", trab_algo: "NINGÚN ALGORITMO ES TU JEFE", trab_desp: "DESPEDIR SALDRÁ CARO", trab_demo: "DEMOCRACIA TAMBIÉN EN EL CURRO",
  pens: "PENSIONES DIGNAS POR LEY", cuid: "CUIDAR ES UN DERECHO", crianza: "200 € AL MES POR CRIATURA", imv: "QUE NADIE SE QUEDE ATRÁS", inclus: "NADIE SE QUEDA FUERA",
  sanidad: "SANIDAD 100 % PÚBLICA", smental: "SALUD MENTAL PARA TODAS", educ: "EDUCACIÓN GRATIS DE 0 A LA UNI", cultura: "MEMORIA, VERDAD Y CULTURA", fem: "VIVAS, LIBRES Y SIN MIEDO",
  voto16: "A LOS 16, A VOTAR", socied: "QUE PAGUEN LAS GRANDES", patrim: "IMPUESTO A LOS ULTRARRICOS", capital: "TU NÓMINA NO PAGA MÁS QUE SU DIVIDENDO", iva: "MENOS IVA EN TU CESTA",
  lujo: "QUE PAGUE EL JET, NO TU COCHE", fraude: "GUERRA AL FRAUDE FISCAL", precios: "TOPE A LOS PRECIOS ABUSIVOS", energia: "ENERGÍA PÚBLICA Y LIMPIA", transp: "UN ABONO PARA TODO EL PAÍS",
  turismo: "TURISMO SÍ, EXPULSIÓN NO", agua: "EL AGUA ES DE TODAS", empub: "LO PÚBLICO FUNCIONA", banca: "BANCA PÚBLICA EN CADA PUEBLO", agro: "QUIEN CULTIVA, QUE COBRE",
  pymes: "EL BARRIO ANTES QUE LA MULTINACIONAL", despob: "SERVICIOS EN CADA PUEBLO", insular: "ISLAS CONECTADAS", empleo_pub: "MÁS MANOS EN LO PÚBLICO", medios: "INFORMACIÓN LIBRE, NO DE MAGNATES",
  digital: "STOP BULOS", lgtbi: "IGUALDAD PARA TODES", migra: "DERECHOS SIN FRONTERAS", gitano: "STOP ANTIGITANISMO", paz: "MÁS HOSPITALES, MENOS TANQUES", europa: "UNA EUROPA DE LOS PUEBLOS",
  mordaza: "FUERA LA LEY MORDAZA", justicia: "JUSTICIA PARA TODAS", todo: "UN VOTO COMO UNA CASA",
};
const ROUND_CRY = ["¡SOMOS MÁS!", "¡UNIDAS GANAMOS!", "¡A POR ELLOS… A LAS URNAS!", "¡QUE PAGUEN LOS DE ARRIBA!", "¡EL 29N, FRENTE AMPLIO!", "¡NI UN PASO ATRÁS!", "¡UN VOTO COMO UNA CASA!", "¡ESTO NO HA HECHO MÁS QUE EMPEZAR!"];
const STAGES = [{ n: "EL BARRIO", ci: 0, c: "#ffe1ec" }, { n: "EL CURRO", ci: 1, c: "#e1ecff" }, { n: "LA URNA", ci: 8, c: "#efe1ff" }];
// ---------- Personajes: avatares circulares de línea fina, en color ----------
// EL MAL: traje oscuro y corbata, cejas fruncidas, mirada entornada, sonrisa torcida; complementos de poder.
// EL BIEN: ropa de diario en colores vivos, cejas relajadas, sonrisa; complementos de oficio y de lucha.
// MULTITUD: ropa neutra, gesto neutro.
const SKINS = ["#ffe0c7", "#f5c9a6", "#e0a77f", "#c68642", "#8d5524", "#5c3a1e"];
const HAIRC = ["#1f2430", "#3b2a20", "#6b4226", "#a0522d", "#d9b26f", "#9aa0a6", "#2f2a3a"];
const LOOKS = {
  rico:     { hair: ["slick", "bald", "slick", "short"], face: ["monocle", "mustache", "cigar", "none"], top: ["tophat", "none", "none", "crown"], outfit: ["suit"], cloth: ["#2d3142", "#3d405b", "#22223b"], acc: ["#d4a017", "#b5172f"], mood: "smirk", bg: ["#d9d4e6", "#cfd6e3", "#e3dccb"] },
  politico: { hair: ["slick", "short", "bob", "slick"], face: ["sunglasses", "none", "none", "squareglasses"], top: ["none"], outfit: ["suit"], cloth: ["#1d3557", "#2b2d42", "#3a506b"], acc: ["#e63946", "#457b9d", "#d4a017"], mood: "fake", bg: ["#d3dbe8", "#d9d4e6", "#cfd6e3"] },
  bulo:     { hair: ["spiky", "capback", "spiky", "short"], face: ["sunglasses", "none", "sunglasses"], top: ["none"], outfit: ["hoodie"], cloth: ["#4a4e69", "#5c5470", "#495057"], acc: ["#ff7b00", "#e63946"], mood: "shout", bg: ["#dedbe2", "#d7d9de"] },
  patronal: { hair: ["short", "bald", "slick", "bob"], face: ["mustache", "squareglasses", "none"], top: ["none"], outfit: ["shirt"], cloth: ["#e8e8ef", "#dfe7ef"], acc: ["#22223b", "#7b2cbf"], mood: "frown", bg: ["#d9dde3", "#e0dbd6"] },
  pueblo:   { hair: ["long", "bob", "bun", "curly", "short", "ponytail", "buzz", "afro", "fringe"], face: ["none", "roundglasses", "none", "beard", "none"], top: ["none", "none", "beanie", "hardhat", "none", "scarfhead"], outfit: ["tee", "tee", "scrubs", "apron", "tee"], cloth: ["#ff9f1c", "#2ec4b6", "#ff6b6b", "#ffd23f", "#8ac926", "#4cc9f0", "#c77dff"], acc: ["#ff6b6b", "#2ec4b6", "#ffd23f"], mood: "kind", bg: ["#ffe8c2", "#d8f3ec", "#ffe0e6", "#e2efff", "#efe3ff"] },
  aliado:   { hair: ["curly", "bun", "short", "long", "afro", "ponytail"], face: ["none", "roundglasses", "beard"], top: ["headband", "beret", "headband", "none"], outfit: ["teestar"], cloth: ["#e63946", "#2a9d8f", "#ffb703", "#6a4c93"], acc: ["#e63946", "#ffd23f"], mood: "brave", bg: ["#ffe8c2", "#d8f3ec", "#ffe0e6", "#e2efff"] },
};
const CROWD = { hair: ["long", "bob", "bun", "curly", "short", "ponytail", "buzz", "afro", "fringe", "bald", "slick"], face: ["none", "none", "none", "roundglasses", "beard", "squareglasses"], top: ["none"], outfit: ["tee"], cloth: ["#c9ced6", "#d8cfc4", "#b8c4bb", "#cdc3d9", "#e2d6b8", "#bcc8d6"], acc: ["#9aa0a6"], mood: "plain", bg: ["#e9ebee", "#eceae6", "#e6ebe8", "#ebe8ee"] };
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const pick = (a, n) => a[(n >>> 0) % a.length];
const FEM_HAIR = ["long", "bob", "bun", "ponytail", "curly", "afro", "fringe"];
const MASC_HAIR = ["short", "buzz", "slick", "bald", "curly", "afro", "spiky", "bun"];
const OLD_RE = /abuel|jubilad|pensionista|veterano|señor|anciano/i;
function genderOf(name) { return /^(La|Las)\b/.test(name) ? "f" : /^(El|Los)\b/.test(name) ? "m" : null; }
function makeLook(L, n, gender, old) {
  const g = gender || (n() % 2 ? "f" : "m");
  let hairPool = L.hair.filter((h) => (g === "f" ? FEM_HAIR : MASC_HAIR).includes(h));
  if (!hairPool.length) hairPool = g === "f" ? ["bob", "bun", "long"] : ["short", "slick", "bald"];
  let face = pick(L.face, n());
  if (g === "f" && (face === "mustache" || face === "beard")) face = "none";
  let top = pick(L.top, n());
  // pañuelo en la cabeza para algunas mujeres (no en el bando del mal)
  if (g === "f" && L.mood !== "smirk" && L.mood !== "fake" && L.mood !== "shout" && L.mood !== "frown" && n() % 8 === 0) top = "scarfhead";
  const hairC = old ? pick(["#c9ccd1", "#e6e6e6", "#9aa0a6"], n()) : pick(HAIRC, n());
  return { skin: pick(SKINS, n()), hairC, hair: pick(hairPool, n()), face, top, outfit: pick(L.outfit, n()), cloth: pick(L.cloth, n()), acc: pick(L.acc, n()), bg: pick(L.bg, n()), mood: L.mood, tilt: (n() % 9) - 4, g, old };
}
function lookFor(id) { const c = CH[id]; let h = hash(id + c.n); const n = () => (h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0); return makeLook(LOOKS[c.cat], n, genderOf(c.n), OLD_RE.test(c.n)); }
function crowdLook(r) { const n = () => Math.floor(r() * 4294967295); return makeLook(CROWD, n, null, n() % 6 === 0); }

const K = "#1f2430";
const sw = { stroke: K, strokeWidth: 2.2, strokeLinejoin: "round", strokeLinecap: "round" };
function HairBack({ t, c }) {
  switch (t) {
    case "long": return <path d="M28 46 Q26 20 50 18 Q74 20 72 46 L74 80 L64 78 L66 50 L34 50 L36 78 L26 80 Z" fill={c} {...sw} />;
    case "bob": return <path d="M27 50 Q24 20 50 18 Q76 20 73 50 L76 66 L62 64 L64 46 L36 46 L38 64 L24 66 Z" fill={c} {...sw} />;
    case "ponytail": return <path d="M66 30 Q84 36 78 64 Q74 52 68 44 Z" fill={c} {...sw} />;
    case "afro": return <g fill={c} {...sw}><circle cx="50" cy="32" r="24" /></g>;
    case "curly": return <g fill={c} {...sw}>{[[30, 34], [36, 24], [46, 19], [56, 19], [65, 24], [70, 34], [72, 46], [28, 46]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" />)}</g>;
    default: return null;
  }
}
function HairFront({ t, c }) {
  switch (t) {
    case "long": case "ponytail": return <path d="M31 42 Q34 22 50 22 Q66 22 69 42 Q60 30 50 30 Q40 30 31 42 Z" fill={c} {...sw} />;
    case "bob": return <path d="M30 40 Q32 20 50 20 Q68 20 70 40 L64 36 L58 40 L52 35 L46 40 L40 35 L34 40 Z" fill={c} {...sw} />;
    case "fringe": return <path d="M30 44 Q30 18 50 18 Q70 18 70 44 Q66 32 58 31 L54 36 L50 31 L46 36 L42 31 Q34 32 30 44 Z" fill={c} {...sw} />;
    case "bun": return <g><circle cx="50" cy="15" r="8" fill={c} {...sw} /><path d="M31 40 Q32 21 50 21 Q68 21 69 40 Q60 29 50 29 Q40 29 31 40 Z" fill={c} {...sw} /></g>;
    case "short": return <path d="M31 40 Q30 20 50 20 Q70 20 69 40 Q66 30 56 29 Q44 28 31 40 Z" fill={c} {...sw} />;
    case "buzz": return <path d="M32 36 Q34 22 50 22 Q66 22 68 36 Q50 28 32 36 Z" fill={c} opacity=".85" {...sw} />;
    case "spiky": return <path d="M31 40 L30 24 L37 28 L39 16 L46 24 L51 13 L56 23 L63 15 L64 27 L71 24 L69 40 Q50 30 31 40 Z" fill={c} {...sw} />;
    case "slick": return <path d="M30 42 Q28 20 50 19 Q72 20 70 40 Q64 26 44 28 Q36 30 30 42 Z" fill={c} {...sw} />;
    case "capback": return <g><path d="M30 36 Q30 20 50 20 Q70 20 70 36 Z" fill="#e63946" {...sw} /><path d="M24 30 L34 26 L34 33 Z" fill="#e63946" {...sw} /></g>;
    case "curly": case "afro": return <path d="M32 38 Q36 26 50 26 Q64 26 68 38 Q58 32 50 32 Q42 32 32 38 Z" fill={c} {...sw} />;
    default: return null;
  }
}
function Top({ t, acc }) {
  switch (t) {
    case "tophat": return <g><rect x="36" y="2" width="28" height="20" rx="2" fill={K} /><rect x="36" y="16" width="28" height="4" fill="#b5172f" /><rect x="28" y="20" width="44" height="5" rx="2.5" fill={K} /></g>;
    case "crown": return <path d="M34 24 L35 8 L43 16 L50 4 L57 16 L65 8 L66 24 Z" fill="#f4c430" {...sw} />;
    case "beanie": return <g><path d="M30 34 Q30 14 50 14 Q70 14 70 34 Z" fill={acc} {...sw} /><rect x="29" y="30" width="42" height="7" rx="3" fill={acc} {...sw} /><circle cx="50" cy="12" r="4.5" fill="#fff" {...sw} /></g>;
    case "hardhat": return <g><path d="M30 32 Q30 12 50 12 Q70 12 70 32 Z" fill="#ffd23f" {...sw} /><rect x="25" y="29" width="50" height="6" rx="3" fill="#ffd23f" {...sw} /></g>;
    case "scarfhead": return <path d="M28 52 Q26 16 50 16 Q74 16 72 52 Q66 30 50 30 Q34 30 28 52 Z" fill={acc} {...sw} />;
    case "headband": return <g><path d="M30 36 Q50 28 70 36 L70 41 Q50 33 30 41 Z" fill="#e63946" {...sw} /><path d="M70 37 L78 32 L77 42 Z" fill="#e63946" {...sw} /></g>;
    case "beret": return <g><ellipse cx="46" cy="24" rx="22" ry="7" fill="#c1121f" {...sw} transform="rotate(-10 46 24)" /><path d="M46 17 L47 13" {...sw} /></g>;
    default: return null;
  }
}
function Outfit({ t, cloth, acc, skin }) {
  const body = "M12 100 Q14 80 36 76 L64 76 Q86 80 88 100 Z";
  switch (t) {
    case "suit": return <g><path d={body} fill={cloth} {...sw} /><path d="M40 76 L50 92 L60 76 Z" fill="#fff" {...sw} /><path d="M47 80 L53 80 L52 84 L55 98 L50 102 L45 98 L48 84 Z" fill={acc} {...sw} /><path d="M36 76 L46 94 M64 76 L54 94" {...sw} /></g>;
    case "shirt": return <g><path d={body} fill={cloth} {...sw} /><path d="M40 76 L50 86 L60 76" fill="none" {...sw} /><path d="M48 84 L52 84 L54 100 L46 100 Z" fill={acc} {...sw} /></g>;
    case "hoodie": return <g><path d={body} fill={cloth} {...sw} /><path d="M36 76 Q50 90 64 76" fill="none" {...sw} /><path d="M46 84 L45 94 M54 84 L55 94" {...sw} /></g>;
    case "scrubs": return <g><path d={body} fill="#5ec2b7" {...sw} /><path d="M42 76 L50 86 L58 76" fill="none" {...sw} /></g>;
    case "apron": return <g><path d={body} fill={cloth} {...sw} /><path d="M38 82 L62 82 L64 100 L36 100 Z" fill="#fff" {...sw} /></g>;
    case "teestar": return <g><path d={body} fill={cloth} {...sw} /><path d="M42 76 Q50 82 58 76" fill="none" {...sw} /><path d="M50 84 L52.5 89 L58 89.5 L54 93 L55 98.5 L50 95.5 L45 98.5 L46 93 L42 89.5 L47.5 89 Z" fill="#ffd23f" {...sw} /></g>;
    default: return <g><path d={body} fill={cloth} {...sw} /><path d="M42 76 Q50 82 58 76" fill="none" {...sw} /></g>;
  }
}
function Face({ mood, face, talk = 0 }) {
  const e = { fill: K };
  const lips = "#e07a8a";
  let brows = null, eyes = <g><circle cx="43" cy="50" r="1.9" {...e} /><circle cx="57" cy="50" r="1.9" {...e} /></g>, mouth = null;
  if (["smirk", "fake", "frown", "shout"].includes(mood)) {
    brows = <path d="M37 42 L46 46 M63 42 L54 46" {...sw} strokeWidth="2.6" />;
    eyes = <g><path d="M40 50 L46 50 M54 50 L60 50" {...sw} strokeWidth="2.6" /><circle cx="44" cy="51" r="1.4" {...e} /><circle cx="58" cy="51" r="1.4" {...e} /></g>;
  }
  if (mood === "smirk") mouth = <path d="M44 66 Q52 68 58 62" fill="none" {...sw} />;
  if (mood === "fake") mouth = <g><path d="M41 63 L59 63 Q57 70 50 70 Q43 70 41 63 Z" fill="#fff" {...sw} /><path d="M45 63 L45 68 M50 63 L50 70 M55 63 L55 68" stroke={K} strokeWidth="1.2" /></g>;
  if (mood === "frown") mouth = <path d="M43 68 Q50 62 57 68" fill="none" {...sw} />;
  if (mood === "shout") mouth = <path d="M42 62 L58 62 L55 71 L45 71 Z" fill="#7a1f2b" {...sw} />;
  if (mood === "plain") { brows = <path d="M39 44 L46 44 M54 44 L61 44" {...sw} strokeWidth="1.6" />; mouth = <ellipse cx="50" cy="65" rx="3.5" ry="2" fill="#c9a0a0" />; }
  if (mood === "kind" || mood === "brave") {
    brows = mood === "brave" ? <path d="M38 43 L46 44 M62 43 L54 44" {...sw} strokeWidth="2.4" /> : <path d="M38 44 Q42 41 46 43 M54 43 Q58 41 62 44" fill="none" {...sw} strokeWidth="1.8" />;
    eyes = <g><circle cx="43" cy="50" r="2.3" {...e} /><circle cx="57" cy="50" r="2.3" {...e} /><circle cx="35" cy="58" r="3.5" fill="#ff9aa8" opacity=".55" /><circle cx="65" cy="58" r="3.5" fill="#ff9aa8" opacity=".55" /></g>;
    mouth = <path d="M42 62 Q50 72 58 62 Z" fill={lips} {...sw} />;
  }
  const nose = <path d="M50 52 Q47 58 51 58" fill="none" {...sw} strokeWidth="1.6" />;
  let item = null;
  if (face === "monocle") item = <g><circle cx="57" cy="50" r="6" fill="none" stroke="#d4a017" strokeWidth="2.2" /><path d="M62 53 Q66 64 62 74" fill="none" stroke="#d4a017" strokeWidth="1.4" /></g>;
  if (face === "mustache") item = <path d="M50 60 Q42 56 36 63 Q42 60 44 64 Q48 64 50 61 Q52 64 56 64 Q58 60 64 63 Q58 56 50 60 Z" fill={K} />;
  if (face === "cigar") item = <g><rect x="54" y="62" width="16" height="4" rx="1.5" fill="#7a4b2a" {...sw} strokeWidth="1.4" /><circle cx="71" cy="64" r="1.8" fill="#ff7b00" /><path d="M73 60 Q76 55 73 51" fill="none" stroke="#aab" strokeWidth="1.6" /></g>;
  if (face === "sunglasses") item = <g><rect x="36" y="46" width="13" height="8" rx="2.5" fill="#2b2d42" /><rect x="51" y="46" width="13" height="8" rx="2.5" fill="#2b2d42" /><path d="M49 49 L51 49 M30 48 L36 48 M64 48 L70 48" {...sw} /></g>;
  if (face === "squareglasses") item = <g fill="none" {...sw} strokeWidth="2.4"><rect x="36" y="45" width="13" height="10" rx="2" /><rect x="51" y="45" width="13" height="10" rx="2" /><path d="M49 49 L51 49" /></g>;
  if (face === "roundglasses") item = <g fill="none" {...sw} strokeWidth="1.8"><circle cx="43" cy="50" r="6" /><circle cx="57" cy="50" r="6" /><path d="M49 50 L51 50" /></g>;
  if (face === "beard") item = <path d="M33 56 Q34 76 50 78 Q66 76 67 56 Q62 66 56 66 Q50 72 44 66 Q38 66 33 56 Z" fill="#3b2a20" opacity=".85" {...sw} strokeWidth="1.6" />;
  return <g>{brows}{eyes}{nose}<g className={"mouth m" + talk}>{mouth}</g>{item}</g>;
}
function Bicho({ look, size = 60, silhouette = false, ring, talk = 0 }) {
  const { skin, hairC, hair, face, top, outfit, cloth, acc, bg, mood } = look;
  const cid = "c" + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      <defs><clipPath id={cid}><circle cx="50" cy="50" r="47" /></clipPath>
        <radialGradient id={cid + "h"} cx="38%" cy="30%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></radialGradient>
        <linearGradient id={cid + "b"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".25" /><stop offset="1" stopColor="#000" stopOpacity=".3" /></linearGradient>
        <radialGradient id={cid + "g"} cx="35%" cy="28%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></radialGradient></defs>
      <g style={silhouette ? { filter: "brightness(0) opacity(.75)" } : null}>
        <circle cx="50" cy="50" r="47" fill={bg} /><circle cx="50" cy="50" r="47" fill={`url(#${cid}g)`} />
        <g clipPath={`url(#${cid})`}>
          <HairBack t={hair} c={hairC} />
          <rect x="44" y="64" width="12" height="14" fill={skin} {...sw} />
          <Outfit t={outfit} cloth={cloth} acc={acc} skin={skin} /><path d="M12 100 Q14 80 36 76 L64 76 Q86 80 88 100 Z" fill={`url(#${cid}b)`} />
          <ellipse cx="29" cy="52" rx="4" ry="5.5" fill={skin} {...sw} /><ellipse cx="71" cy="52" rx="4" ry="5.5" fill={skin} {...sw} />
          <ellipse cx="50" cy="50" rx="20" ry="24" fill={skin} {...sw} /><ellipse cx="50" cy="50" rx="20" ry="24" fill={`url(#${cid}h)`} />
          {!silhouette && <Face mood={mood} face={face} talk={talk} />}
          {!silhouette && look.old && <path d="M34 44 Q37 42 40 44 M60 44 Q63 42 66 44 M38 62 Q36 66 38 69 M62 62 Q64 66 62 69" fill="none" stroke="#1f2430" strokeWidth="1.1" opacity=".55" />}
          <HairFront t={hair} c={hairC} />
          {hair === "bald" && <path d="M36 32 Q42 28 46 30" fill="none" stroke="#fff" strokeWidth="2" opacity=".6" />}
        </g>
        <Top t={top} acc={acc} />
        <circle cx="50" cy="50" r="47" fill="none" stroke={ring || K} strokeWidth={ring ? 5 : 2.4} />
      </g>
    </svg>
  );
}

const W = 1000, H = 620;
// ---------- Escenarios dibujados (línea fina) y tipos de caos ----------
const LN = { stroke: "#1f2430", strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" };
function Win({ x, y, w = 40, h = 50, f = "#cfe3f5" }) { return <g><rect x={x} y={y} width={w} height={h} rx="3" fill={f} {...LN} /><path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} {...LN} strokeWidth="1.2" /></g>; }
function Bg({ ci }) {
  const sky = <rect width="1000" height="620" fill="#fbfbfd" />;
  const floor = (y, f) => <rect x="0" y={y} width="1000" height={620 - y} fill={f} />;
  const scenes = {
    0: <g>{sky}{floor(470, "#e8e4ef")}
      {[[20, 180, 210, "#ffd9c7"], [235, 120, 200, "#d9e8f5"], [440, 160, 220, "#f3e3c3"], [665, 100, 160, "#e2d9f3"], [830, 150, 160, "#d6eedf"]].map(([x, y, w, f], i) => <g key={i}><rect x={x} y={y} width={w} height={470 - y} fill={f} {...LN} />{Array.from({ length: Math.floor((470 - y - 40) / 80) }, (_, r) => Array.from({ length: Math.floor(w / 60) }, (_, c) => <Win key={r + "-" + c} x={x + 14 + c * 60} y={y + 20 + r * 80} />))}</g>)}
      <g><rect x="470" y="200" width="120" height="44" fill="#fff" {...LN} /><text x="530" y="230" fontSize="20" fontWeight="900" textAnchor="middle" fill="#d0234f">SE ALQUILA</text></g>
      <g><rect x="250" y="140" width="110" height="36" fill="#fff" {...LN} /><text x="305" y="165" fontSize="16" fontWeight="900" textAnchor="middle" fill="#1f2430">1.400 €/mes</text></g></g>,
    1: <g>{sky}{floor(420, "#e6e9ee")}<rect x="0" y="40" width="1000" height="380" fill="#eef1f6" {...LN} />
      {[80, 330, 580, 830].map((x) => <g key={x}><rect x={x} y="80" width="120" height="70" rx="4" fill="#fff" {...LN} /><path d={`M${x + 15} ${x % 2 ? 130 : 120} L${x + 45} 110 L${x + 75} 125 L${x + 105} 95`} fill="none" stroke="#d0234f" strokeWidth="3" /></g>)}
      <rect x="380" y="180" width="240" height="50" rx="6" fill="#1f2430" /><text x="500" y="213" fontSize="22" fontWeight="900" textAnchor="middle" fill="#fff">⏱ FICHAJE 08:00</text>
      {[120, 420, 720].map((x) => <rect key={x} x={x} y="330" width="170" height="22" rx="4" fill="#c9b79c" {...LN} />)}</g>,
    2: <g>{sky}{floor(500, "#ece8df")}<path d="M120 170 L500 60 L880 170 Z" fill="#f1ede4" {...LN} /><rect x="150" y="170" width="700" height="28" fill="#f1ede4" {...LN} />
      {[190, 300, 410, 520, 630, 740].map((x) => <rect key={x} x={x} y="198" width="40" height="260" fill="#fff" {...LN} />)}<rect x="130" y="458" width="740" height="42" fill="#f1ede4" {...LN} />
      <text x="500" y="152" fontSize="34" fontWeight="900" textAnchor="middle" fill="#1f2430">BANCO</text><circle cx="500" cy="112" r="16" fill="#f4c430" {...LN} /><text x="500" y="119" fontSize="18" fontWeight="900" textAnchor="middle">€</text></g>,
    3: <g>{sky}{floor(520, "#eceff3")}{[90, 230, 370].map((y) => <g key={y}><rect x="0" y={y} width="1000" height="12" fill="#c9ced6" {...LN} />{Array.from({ length: 25 }, (_, i) => <rect key={i} x={10 + i * 40} y={y - 46} width="28" height="46" rx="3" fill={["#ffd6a5", "#caffbf", "#9bf6ff", "#ffadad", "#fdffb6", "#bdb2ff"][i % 6]} {...LN} strokeWidth="1.2" />)}</g>)}
      {[[160, "2,99 €"], [520, "4,79 €"], [820, "9,15 €"]].map(([x, t]) => <g key={x}><rect x={x} y="250" width="90" height="34" fill="#ffd23f" {...LN} /><text x={x + 45} y="274" fontSize="18" fontWeight="900" textAnchor="middle">{t}</text></g>)}</g>,
    4: <g>{sky}{floor(450, "#e3f1ef")}<rect x="0" y="40" width="1000" height="410" fill="#f2fbfa" {...LN} /><path d="M0 200 H1000" stroke="#7fd1c7" strokeWidth="10" />
      <g transform="translate(460 70)"><rect width="80" height="80" rx="10" fill="#fff" {...LN} /><path d="M30 12 H50 V30 H68 V50 H50 V68 H30 V50 H12 V30 H30 Z" fill="#2a9d8f" /></g>
      <rect x="700" y="90" width="220" height="60" rx="6" fill="#1f2430" /><text x="810" y="118" fontSize="16" fontWeight="900" textAnchor="middle" fill="#9ef0e4">TURNO</text><text x="810" y="140" fontSize="20" fontWeight="900" textAnchor="middle" fill="#fff">A-127</text>
      {[60, 260].map((x) => <rect key={x} x={x} y="90" width="140" height="80" rx="4" fill="#fff" {...LN} />)}</g>,
    5: <g>{sky}{floor(470, "#f0e6d8")}<rect x="200" y="50" width="600" height="230" rx="6" fill="#2f5d50" stroke="#8b5a2b" strokeWidth="10" />
      <text x="500" y="130" fontSize="34" fill="#fff" textAnchor="middle" fontFamily="cursive">Igualdad de</text><text x="500" y="180" fontSize="34" fill="#fff" textAnchor="middle" fontFamily="cursive">oportunidades</text><path d="M260 230 H420" stroke="#fff" strokeWidth="3" />
      {[60, 880].map((x) => <g key={x}><rect x={x} y="80" width="70" height="90" fill="#fff" {...LN} /><circle cx={x + 35} cy="125" r="22" fill="#cfe3f5" {...LN} /></g>)}</g>,
    6: <g>{sky}{floor(440, "#f3e6dc")}<rect x="0" y="40" width="1000" height="400" fill="#fff5ef" />
      <Win x={100} y={90} w={160} h={130} f="#dceffa" /><Win x={740} y={90} w={160} h={130} f="#dceffa" />
      <g><rect x="400" y="80" width="200" height="140" fill="#fff" {...LN} /><path d="M420 200 L470 140 L510 180 L540 150 L580 200 Z" fill="#b5e48c" {...LN} /><circle cx="550" cy="110" r="14" fill="#ffd23f" {...LN} /></g>
      <rect x="300" y="330" width="400" height="70" rx="20" fill="#e5989b" {...LN} /></g>,
    7: <g>{sky}<rect width="1000" height="620" fill="#f2f0fb" />{[[40, 60], [300, 40], [560, 70], [800, 50]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width="170" height="250" rx="22" fill="#1f2430" /><rect x={x + 10} y={y + 26} width="150" height="200" rx="8" fill="#fff" />
      <rect x={x + 22} y={y + 40} width="126" height="16" rx="8" fill="#ffadad" /><rect x={x + 22} y={y + 64} width="90" height="10" rx="5" fill="#cfd8dc" /><rect x={x + 22} y={y + 84} width="110" height="60" rx="6" fill="#e2d9f3" /><text x={x + 85} y={y + 175} fontSize="14" fontWeight="900" textAnchor="middle" fill="#d0234f">¡¡URGENTE!!</text></g>)}</g>,
    8: <g>{sky}{floor(460, "#e9e6f2")}<path d="M150 200 Q500 20 850 200 Z" fill="#efe9f7" {...LN} /><rect x="150" y="200" width="700" height="260" fill="#f6f3fb" {...LN} />
      {[210, 330, 450, 570, 690, 790].map((x) => <rect key={x} x={x} y="220" width="30" height="220" fill="#fff" {...LN} />)}
      <g transform="translate(430 300)"><rect width="140" height="100" fill="#fff" {...LN} /><rect x="45" y="-6" width="50" height="10" fill="#1f2430" /><text x="70" y="62" fontSize="26" fontWeight="900" textAnchor="middle">29N</text></g></g>,
    9: <g><rect width="1000" height="620" fill="#eaf6ff" /><path d="M0 260 Q200 180 400 250 Q650 330 1000 220 V620 H0 Z" fill="#cfe8b5" {...LN} /><path d="M0 380 Q300 330 600 390 Q800 430 1000 370 V620 H0 Z" fill="#e9d8a6" {...LN} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 75} 620 L${i * 75 + 140} 400`} stroke="#c9a85c" strokeWidth="2" />)}<circle cx="860" cy="90" r="40" fill="#ffd23f" {...LN} />
      <g transform="translate(120 170)"><rect width="70" height="60" fill="#fff" {...LN} /><path d="M-8 0 L35 -34 L78 0 Z" fill="#e07a5f" {...LN} /></g></g>,
    10: <g>{sky}{floor(430, "#e6e9ee")}<rect x="0" y="80" width="1000" height="60" fill="#1f2430" /><text x="40" y="120" fontSize="22" fontWeight="900" fill="#ffd23f">LLEGADAS · ARRIVALS · وصول · 到达</text>
      {[0, 1, 2, 3].map((i) => <g key={i}><rect x={60 + i * 230} y="170" width="190" height="34" rx="4" fill="#fff" {...LN} /><text x={155 + i * 230} y="193" fontSize="15" fontWeight="900" textAnchor="middle">{["CITA PREVIA: NO HAY", "VENTANILLA 3", "EXTRANJERÍA", "SALIDA →"][i]}</text></g>)}
      <path d="M0 380 H1000" stroke="#c9ced6" strokeWidth="8" strokeDasharray="30 20" /></g>,
    11: <g><rect width="1000" height="620" fill="#dff3fb" /><path d="M0 420 Q250 390 500 420 Q750 450 1000 420 V620 H0 Z" fill="#9fd8ef" {...LN} /><circle cx="500" cy="230" r="150" fill="#bde0fe" {...LN} />
      <path d="M400 160 Q440 120 500 150 Q540 170 520 210 Q480 240 440 220 Q390 200 400 160 Z M520 260 Q570 240 600 280 Q590 330 540 330 Q510 300 520 260 Z" fill="#b5e48c" {...LN} />
      <g transform="translate(820 360)"><path d="M0 0 L120 0 L100 30 L20 30 Z" fill="#fff" {...LN} /><rect x="40" y="-30" width="40" height="30" fill="#fff" {...LN} /></g></g>,
    12: <g>{sky}{floor(430, "#f1ebe2")}{[[60, "VIVIENDA DIGNA"], [380, "¡NI UN DESAHUCIO MÁS!"], [700, "32 HORAS YA"]].map(([x, t]) => <g key={x}><path d={`M${x} 160 L${x} 90 M${x + 240} 160 L${x + 240} 90`} {...LN} strokeWidth="3" /><rect x={x} y="80" width="240" height="56" rx="4" fill={x === 380 ? "#d0234f" : "#fff"} {...LN} /><text x={x + 120} y="115" fontSize="18" fontWeight="900" textAnchor="middle" fill={x === 380 ? "#fff" : "#1f2430"}>{t}</text></g>)}
      <path d="M0 260 Q500 230 1000 260" stroke="#1f2430" strokeWidth="1.5" fill="none" />{Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${25 + i * 50} ${255 - Math.sin(i / 3) * 6} l10 22 l10 -22 Z`} fill={["#d0234f", "#ffd23f", "#1c9bd6"][i % 3]} />)}</g>,
  };
  return <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>{scenes[ci]}</svg>;
}

// Tipos de caos (cómo se coloca la gente). Varían escena a escena y se mezclan con apagón, niebla, siluetas…
const CHAOS = {
  dispersos: { t: "", d: "" },
  cola:      { t: "🧍 Cola infinita", d: "Todo el mundo hace cola. Repasa la fila con calma." },
  corros:    { t: "💬 Corrillos", d: "La gente se junta en corros. Busca en cada grupo." },
  gradas:    { t: "🏟️ Abarrotado", d: "No cabe un alma. Están unos encima de otros." },
  remolino:  { t: "🌀 Remolino", d: "La multitud gira en espiral." },
  desfile:   { t: "🚶 En marcha", d: "La gente no para de moverse. ¡Atrapa a tu objetivo al pasar!" },
  escondidos:{ t: "🙈 Escondidos", d: "Se esconden detrás de mostradores y mesas. Solo asoman la cabeza." },
  ventanas:  { t: "🪟 Ventanas", d: "Cada cual en su piso. Mira ventana por ventana." },
};
function chaosFor(g) {
  if (g < 2) return "dispersos";
  if (g === 2 || g === 3) return "ventanas";
  return ["cola", "corros", "gradas", "escondidos", "remolino", "desfile", "dispersos"][(g - 4) % 7];
}
function shadedFor(g) { return g >= 12 && g % 5 === 2; }

function layoutPoints(kind, n, size, r) {
  const P = [];
  const jit = (v) => v + (r() - 0.5) * size * 0.18;
  const rowsLayout = (R, y0, y1, snake) => { const per = Math.ceil(n / R); for (let i = 0; i < n; i++) { const row = Math.floor(i / per), col = i % per, sp = 880 / Math.max(1, per - 1 || 1); const x = per === 1 ? 500 : 60 + (snake && row % 2 ? per - 1 - col : col) * sp + (row % 2) * sp * 0.35; P.push({ x: jit(x), y: y0 + (R === 1 ? 0 : (row * (y1 - y0)) / (R - 1)) + (snake ? Math.sin(col / 1.5) * 8 : 0) }); } };
  if (kind === "cola") {
    rowsLayout(Math.max(3, Math.min(6, Math.ceil(n / 14))), 100, 560, true);
  } else if (kind === "corros") {
    const k = Math.max(3, Math.round(n / 7)); const centers = Array.from({ length: k }, (_, i) => ({ x: 120 + ((i * 397) % 760), y: 120 + ((i * 211) % 400) }));
    for (let i = 0; i < n; i++) { const c = centers[i % k], ring = Math.floor(i / k), a = (i / k) * 2.4 + r(); const rad = size * (0.6 + ring * 0.45); P.push({ x: c.x + Math.cos(a) * rad, y: c.y + Math.sin(a) * rad * 0.75 }); }
  } else if (kind === "gradas") {
    rowsLayout(Math.max(5, Math.min(9, Math.ceil(n / 12))), 80, 570, false);
  } else if (kind === "escondidos") {
    rowsLayout(4, 110, 540, false);
  } else if (kind === "remolino") {
    for (let i = 0; i < n; i++) { const a = i * 0.52, rad = 30 + i * (260 / n) * 1.0; P.push({ x: 500 + Math.cos(a) * rad * 1.6, y: 310 + Math.sin(a) * rad }); }
  } else if (kind === "ventanas") {
    const wins = []; [[20, 180, 210], [235, 120, 200], [440, 160, 220], [665, 100, 160], [830, 150, 160]].forEach(([x, y, w]) => { for (let rr = 0; rr < Math.floor((470 - y - 40) / 80); rr++) for (let c = 0; c < Math.floor(w / 60); c++) wins.push({ x: x + 34 + c * 60, y: y + 42 + rr * 80, win: true }); });
    for (let i = wins.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [wins[i], wins[j]] = [wins[j], wins[i]]; }
    for (let i = 0; i < n; i++) P.push(i < wins.length ? wins[i] : { x: 40 + r() * 920, y: 520 + r() * 70 });
  } else {
    for (let i = 0; i < n; i++) {
      let best = null; for (let k = 0; k < 30; k++) { const c = { x: 40 + r() * 920, y: 60 + r() * 520 }; const d = Math.min(1e9, ...P.map((p) => Math.hypot(p.x - c.x, p.y - c.y))); if (!best || d > best.d) best = { ...c, d }; if (d > size * 0.9) break; } P.push({ x: best.x, y: best.y });
    }
  }
  return P.map((p) => ({ ...p, x: Math.max(25, Math.min(975, p.x)), y: Math.max(30, Math.min(600, p.y)) }));
}

// ---------- Botón NO PULSAR ----------
const NOPRESS = [
  ["🙃", "Te dijimos que no lo pulsaras…", "Pero ya que estás pulsando cosas: el 29N pulsa la urna. Vota Frente Amplio."],
  ["🏠", "¡Pulsado!", "Un clic no cambia el mundo. Un voto el 29N sí puede cambiar tu alquiler."],
  ["⏰", "Botón de las 32 horas activado", "Bueno, todavía no. Para activarlo de verdad hay que votar Frente Amplio el 29N."],
  ["📮", "Error 29N", "Este botón solo funciona dentro de una urna. Lleva tu papeleta del Frente Amplio."],
  ["💪", "Tienes el dedo en forma", "Úsalo el 29N para coger la papeleta del Frente Amplio. Y arrastra a alguien contigo."],
  ["🎉", "¡Enhorabuena!", "Has ganado… la posibilidad de decidir tu futuro el 29N. Es gratis y dura cuatro años."],
  ["🫶", "Lo sabíamos", "Eres de las que pulsan botones prohibidos. Justo lo que necesita el país: gente que no se resigna."],
  ["🌱", "Has plantado una semilla", "Riégala el 29N: vota Frente Amplio y que crezcan 1,5 millones de viviendas públicas."],
  ["📣", "¡Atención, vecindario!", "Este botón ha avisado a tu barrio: el 29N se vota. Y se vota Frente Amplio."],
  ["🔑", "Has desbloqueado una llave", "Abre una casa pública con alquiler al 25 % de tus ingresos. Se activa votando Frente Amplio el 29N."],
  ["☀️", "Buenas noticias", "El futuro no está escrito. Lo escribimos juntas el 29N."],
  ["🧡", "Gracias por pulsar", "Si pulsas así de bien, imagina lo que harás el 29N con una papeleta del Frente Amplio."],
  ["🧮", "Cálculo rápido", "Un voto + otro voto + el tuyo = un gobierno que ponga la vida en el centro. Frente Amplio, 29N."],
  ["🚀", "Despegue autorizado", "Destino: un país donde vivir no sea un lujo. Embarque: 29N, colegio electoral."],
  ["🍀", "Hoy es tu día de suerte", "Y el 29N puede ser el de todo el país. Vota Frente Amplio."],
];
// Eslóganes generados a partir de las medidas del programa del Frente Amplio (40 medidas × 5 tonos = 200)
const MEDIDAS = [
  ["🏠", "1,5 millones de viviendas públicas"], ["💶", "alquileres topados al 25 % de lo que ingresas"], ["🚫", "ni un desahucio sin alternativa habitacional"],
  ["🧳", "barrios sin pisos turísticos que expulsan a la vecindad"], ["⚖️", "el derecho a la vivienda exigible ante los tribunales"], ["🦅", "las casas de los fondos buitre al servicio de la gente"],
  ["⏰", "la jornada de 32 horas sin bajar el sueldo"], ["💪", "un salario mínimo blindado en el 60 % del salario medio"], ["🧾", "IRPF cero para quien cobra el salario mínimo"],
  ["🤖", "que ningún algoritmo te despida sin una persona que lo revise"], ["🧓", "pensiones revalorizadas por mandato constitucional"], ["👶", "200 € al mes por cada menor para acabar con la pobreza infantil"],
  ["🫶", "un Pacto de Estado por los Cuidados"], ["🏥", "una sanidad 100 % pública con el 8 % del PIB"], ["🧠", "10 profesionales de salud mental por cada 100.000 habitantes"],
  ["🦷", "dentista, gafas y audífonos en la sanidad pública"], ["🎒", "educación gratuita desde los 0 años hasta la universidad"], ["📚", "el 7 % del PIB para la educación pública"],
  ["🏢", "que las grandes empresas paguen al menos un 20 % real"], ["👑", "un impuesto a los ultrarricos"], ["💎", "un tope de 10 millones por heredero en las grandes herencias"],
  ["🔎", "una lucha de verdad contra el fraude fiscal"], ["🛒", "un IVA más bajo para la cesta básica y la energía"], ["🍎", "topes al precio de los alimentos básicos cuando hay abuso"],
  ["☀️", "energía limpia, pública y asequible"], ["🚌", "un abono único de transporte para todo el Estado"], ["🚆", "un tren público al servicio de los territorios"],
  ["💧", "el agua como bien público"], ["🌾", "un futuro con servicios para la España vaciada"], ["📮", "banca pública en las oficinas de Correos"],
  ["📮", "el voto desde los 16 años"], ["🤐", "el fin de la Ley Mordaza"], ["🕊️", "menos gasto militar y más hospitales"],
  ["🧭", "vías legales y seguras para quien huye"], ["✊🏾", "una ley integral contra el racismo"], ["💜", "vidas libres de violencias machistas"],
  ["🏳️‍🌈", "igualdad real para todas, todos y todes"], ["🎮", "videojuegos sin cajas de recompensa para enganchar a menores"], ["📰", "límites a la concentración de los medios"],
  ["🏭", "democracia también dentro de las empresas"],
];
const TONOS = [
  ["¡Pulsado!", (m) => `Este botón no trae ${m}. Tu voto el 29N, sí. Vota Frente Amplio.`],
  ["Hablemos en serio", (m) => `¿${m[0].toUpperCase() + m.slice(1)}? Eso no cae del cielo: llega si el 29N vamos a votar. Frente Amplio.`],
  ["Compromiso mutuo", (m) => `El Frente Amplio se compromete a ${m.startsWith("que ") ? "conseguir " + m : "traer " + m}. ¿Te comprometes tú a votar el 29N?`],
  ["Tu voto lo hace posible", (m) => `«${m[0].toUpperCase() + m.slice(1)}». Llega al meter la papeleta del Frente Amplio en la urna el 29N.`],
  ["Cierra los ojos", (m) => `Imagina ${m}. Ahora ábrelos, que el 29N hay que votar Frente Amplio para hacerlo realidad.`],
];
const NOPRESS_GEN = MEDIDAS.flatMap(([e, m]) => TONOS.map(([t, f]) => [e, t, f(m)]));

// ===================== ¡TOMA TASA! · 3 niveles =====================
const wa = (t) => "https://api.whatsapp.com/send?text=" + encodeURIComponent(t.normalize("NFC"));
const pickR = (a) => a[Math.floor(Math.random() * a.length)];
const NOPRESS_ALL = NOPRESS.concat(NOPRESS_GEN);
function lookByName(name, L, extra = 0) { let h = hash(name) + extra; const n = () => (h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0); return makeLook(L, n, genderOf(name), OLD_RE.test(name)); }

// ---------- Música electrónica original (un tema por nivel) ----------
const TRACKS = [
  // N1: himno partisano electrónico (menor, marcial, original)
  { bpm: 128, lead: [[69, 2], [74, 1], [76, 1], [77, 2], [74, 2], [69, 2], [74, 1], [76, 1], [77, 2], [74, 2], [69, 1], [74, 1], [76, 1], [77, 1], [81, 2], [79, 1], [77, 1], [76, 2], [74, 2], [0, 2]], bass: [50, 50, 50, 50, 46, 46, 48, 45], drum: "march" },
  // N2: italo-disco (bombo a negras, bajo en octavas)
  { bpm: 124, lead: [[76, 1], [76, 1], [79, 1], [76, 1], [74, 2], [72, 2], [74, 1], [76, 1], [72, 2], [69, 2], [0, 1], [72, 1], [74, 1], [76, 1], [79, 2], [81, 2], [79, 1], [76, 1], [74, 4]], bass: [45, 57, 45, 57, 41, 53, 43, 55], drum: "disco" },
  // N3: electro-pop luminoso
  { bpm: 132, lead: [[72, 1], [76, 1], [79, 1], [84, 1], [83, 2], [79, 2], [81, 1], [79, 1], [76, 1], [72, 1], [74, 4], [72, 1], [76, 1], [79, 1], [84, 1], [86, 2], [84, 2], [83, 1], [81, 1], [79, 2], [84, 4]], bass: [48, 48, 43, 43, 45, 45, 41, 43], drum: "disco" },
  // N4: Himno de Riego (dominio público, 1820) en versión techno — aproximación de la marcha
  { bpm: 134, lead: [[62, 1], [67, 1], [67, 1], [69, 1], [71, 2], [71, 1], [72, 1], [74, 2], [71, 1], [67, 1], [69, 2], [66, 2], [62, 1], [67, 1], [67, 1], [69, 1], [71, 2], [74, 1], [72, 1], [71, 2], [69, 2], [67, 4]], bass: [43, 43, 38, 38, 43, 43, 38, 43], drum: "disco" },
];
const Music = (() => {
  let ctx = null, master, music, sfx, noiseBuf, timer = null, muted = false;
  const init = () => { if (ctx) return true; try { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.connect(ctx.destination); music = ctx.createGain(); music.gain.value = 0.22; music.connect(master); sfx = ctx.createGain(); sfx.gain.value = 0.4; sfx.connect(master); noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return true; } catch (e) { return false; } };
  const N = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const osc = (f, t0, dur, type, g, dest, f2) => { const o = ctx.createOscillator(), a = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur); a.gain.setValueAtTime(0.0001, t0); a.gain.exponentialRampToValueAtTime(g, t0 + 0.01); a.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(a); a.connect(dest); o.start(t0); o.stop(t0 + dur + 0.02); };
  const noise = (t0, dur, g, hp) => { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), a = ctx.createGain(); s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = hp; a.gain.setValueAtTime(g, t0); a.gain.exponentialRampToValueAtTime(0.001, t0 + dur); s.connect(f); f.connect(a); a.connect(music); s.start(t0); s.stop(t0 + dur); };
  const start = (i, speed = 1) => {
    if (!init()) return; if (ctx.state === "suspended") ctx.resume(); stop();
    const T0 = TRACKS[i % TRACKS.length], e16 = 60 / (T0.bpm * speed) / 4; const seq = []; T0.lead.forEach(([n, d]) => { for (let k = 0; k < d * 2; k++) seq.push(k === 0 ? [n, d * 2] : [-1, 0]); });
    let step = 0, next = ctx.currentTime + 0.05;
    timer = setInterval(() => { while (next < ctx.currentTime + 0.12) { if (!muted) {
      const s16 = step % 16, [n, d] = seq[step % seq.length];
      if (n > 0) { osc(N(n), next, e16 * d * 0.9, "sawtooth", 0.16, music); osc(N(n) * 1.005, next, e16 * d * 0.9, "square", 0.08, music); }
      if (s16 % 2 === 0) { const b = T0.bass[Math.floor(step / 8) % T0.bass.length]; osc(N((T0.drum === "disco" && s16 % 4 === 2 ? b + 12 : b) - 12), next, e16 * 1.8, "sawtooth", 0.3, music); }
      if (s16 % 4 === 0) osc(150, next, 0.16, "sine", 1, music, 45);
      if (T0.drum === "march" ? s16 === 4 || s16 === 12 || s16 === 14 : s16 === 4 || s16 === 12) noise(next, 0.15, 0.6, 1800);
      if (s16 % 2 === 1 || T0.drum === "disco") noise(next, 0.03, 0.22, 8000);
      if (s16 % 4 === 0) osc(N(T0.bass[Math.floor(step / 8) % 8] + 24), next, e16 * 3, "triangle", 0.06, music);
    } step++; next += e16; } }, 25);
  };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const fx = (name) => { if (!init() || muted) return; if (ctx.state === "suspended") ctx.resume(); const t = ctx.currentTime;
    if (name === "thudsoft") { osc(140, t, 0.35, "sine", 0.6, sfx, 45); noise(t, 0.25, 0.45, 300); noise(t + 0.06, 0.08, 0.2, 2500); }
    if (name === "thud") { osc(110, t, 0.5, "sine", 1, sfx, 32); osc(60, t, 0.7, "triangle", 0.8, sfx, 25); noise(t, 0.45, 1, 120); noise(t + 0.02, 0.25, 0.7, 900); [0.09, 0.17, 0.26].forEach((d) => noise(t + d, 0.08, 0.35, 2500)); }
    if (name === "tasa") { osc(N(84), t, 0.08, "square", 0.4, sfx); osc(N(91), t + 0.06, 0.12, "square", 0.4, sfx); noise(t, 0.35, 0.5, 3000); }
    if (name === "coin") [88, 93].forEach((n, i) => osc(N(n), t + i * 0.07, 0.12, "triangle", 0.5, sfx));
    if (name === "ray") { noise(t, 0.18, 0.6, 2500); osc(N(76), t + 0.25, 0.12, "triangle", 0.5, sfx); osc(N(83), t + 0.33, 0.18, "triangle", 0.5, sfx); }
    if (name === "miss") osc(140, t, 0.15, "square", 0.3, sfx, 80);
    if (name === "fanfare") { [[60, 0], [64, 0.18], [67, 0.36], [72, 0.54], [67, 0.9], [72, 1.08], [76, 1.26], [79, 1.5]].forEach(([n, d]) => { osc(N(n), t + d, d >= 1.5 ? 1.4 : 0.22, "square", 0.32, sfx); osc(N(n - 12), t + d, d >= 1.5 ? 1.4 : 0.22, "triangle", 0.4, sfx); }); noise(t + 1.5, 1.2, 0.25, 4000); }
    if (name === "win") [72, 76, 79, 84, 88, 91].forEach((n, i) => osc(N(n), t + i * 0.07, 0.25, "square", 0.3, sfx));
    if (name === "alarm") { for (let k = 0; k < 4; k++) { osc(880, t + k * 0.5, 0.24, "square", 0.32, sfx, 660); osc(660, t + k * 0.5 + 0.25, 0.24, "square", 0.32, sfx, 880); } }
    if (name === "tick") osc(N(100), t, 0.04, "square", 0.25, sfx);
    if (name === "wrong") [60, 55].forEach((n, i) => osc(N(n), t + i * 0.15, 0.2, "sawtooth", 0.3, sfx));
  };
  const setMuted = (m) => { muted = m; if (master) master.gain.value = m ? 0 : 1; };
  return { start, stop, fx, setMuted };
})();

// ---------- NIVEL 1: ricos (arquetipos inventados, ninguna persona real) ----------
// Megarricos inventados (nombres ficticios, sin relación con personas reales). [nombre, género, fortuna en M€]
const RICOS = [
  ["Don Pelotazo de la Rentabilidad", "m", 48000], ["Doña Plusvalía Pérez de Sicav", "f", 31000], ["Borja Mari Dividendo", "m", 22500], ["Mafalda Off-Shore", "f", 19800],
  ["Bosco Ladrillazo", "m", 15200], ["Marisol Mansión-Vacía", "f", 12700], ["Fermín Fondobuitre", "m", 9900], ["Begoña Bonus del Consejo", "f", 8400],
  ["Gonzalo Yate-Grande", "m", 7600], ["Pilarín Paraíso Fiscal", "f", 6300], ["Íñigo Herencia Infinita", "m", 5800], ["Montserrat Monopoli", "f", 4900],
  ["Álvaro Airbnb del Centro", "m", 4100], ["Tita Holding", "f", 3700], ["Jaime Jet Privado", "m", 3200], ["Cuca Comisión", "f", 2600],
];
const SERVICIOS = [["🏥", "SANIDAD", "8 % del PIB para la sanidad pública"], ["🏠", "VIVIENDA", "1,5 millones de viviendas públicas en 12 años"], ["👶", "CRIANZA", "200 € al mes por cada hijo o hija"], ["📚", "EDUCACIÓN", "Que estudiar no dependa del dinero"], ["👵", "PENSIONES", "Envejecer con dignidad"], ["🚆", "TRENES", "Más trenes, mejor servicio, precios más bajos"], ["⚡", "LUZ", "Bajar la factura de la luz"], ["🧾", "IRPF", "Menos IRPF a los salarios bajos"]];
const L1_TIME = 30;

// ---------- NIVEL 2: escaños (datos facilitados por la campaña) ----------
const ESCANOS = [
  ["Asturias", "PP", 1200], ["Las Palmas", "Vox", 2100, true], ["Navarra", "PP", 2500], ["Madrid", "Vox", 28000], ["Tarragona", "PP", 3500], ["Bizkaia", "PP", 4000], ["Santa Cruz de Tenerife", "PP", 3800],
  ["A Coruña", "PP", 6000], ["Sevilla", "PP", 10500], ["Pontevedra", "PP", 5200], ["Zaragoza", "Vox", 5500], ["Granada", "Vox", 5000], ["Málaga", "Vox", 9000], ["Baleares", "Vox", 4500],
  ["Barcelona", "PP", 35000], ["Madrid", "PP", 53000], ["Castellón", "Vox", 5700], ["Alicante", "Vox", 25000], ["Córdoba", "Vox", 15000],
].sort((a, b) => a[2] - b[2]);
const GEO = { "A Coruña": [-8.4, 43.25], "Pontevedra": [-8.55, 42.4], "Asturias": [-5.9, 43.3], "Bizkaia": [-2.9, 43.2], "Navarra": [-1.65, 42.7], "Zaragoza": [-1.0, 41.6], "Barcelona": [1.95, 41.75], "Tarragona": [0.9, 41.05], "Castellón": [-0.25, 40.15], "Madrid|Vox": [-3.7, 40.7], "Madrid|PP": [-3.7, 40.1], "Alicante": [-0.7, 38.4], "Baleares": [2.95, 39.25], "Sevilla": [-5.95, 37.45], "Córdoba": [-4.8, 38.05], "Málaga": [-5.1, 36.55], "Granada": [-2.9, 37.4] };
const proj = ([lon, lat]) => [(lon + 9.6) * 7.8 + 25, (44.2 - lat) * 10];
const projC = ([lon, lat]) => [2 + (lon + 18.3) * 5.2, 58 + (29.6 - lat) * 9];
const CANAR = { "Las Palmas": projC([-14.4, 27.3]), "Santa Cruz de Tenerife": projC([-15.9, 29.35]) };
const poly = (pts, pr = proj) => pts.map(pr).map((p) => p.map((v) => v.toFixed(2)).join(",")).join(" ");
const SPAIN = poly([[-8.87,41.87],[-8.9,42.1],[-8.75,42.25],[-8.88,42.45],[-9.05,42.55],[-9.0,42.75],[-9.3,42.92],[-9.25,43.1],[-8.95,43.25],[-8.5,43.35],[-8.25,43.55],[-7.9,43.75],[-7.6,43.72],[-7.05,43.55],[-6.3,43.57],[-5.85,43.65],[-5.4,43.55],[-4.6,43.4],[-3.8,43.47],[-3.4,43.42],[-3.0,43.38],[-2.4,43.42],[-1.8,43.38],[-1.4,43.25],[-0.7,42.9],[0.0,42.7],[0.7,42.85],[1.4,42.6],[2.0,42.42],[2.6,42.35],[3.17,42.43],[3.3,42.3],[3.1,41.95],[2.8,41.7],[2.2,41.4],[1.6,41.2],[1.0,41.05],[0.7,40.8],[0.9,40.7],[0.5,40.4],[0.1,40.05],[-0.2,39.7],[-0.3,39.4],[-0.1,39.0],[0.2,38.75],[-0.2,38.6],[-0.5,38.35],[-0.7,38.0],[-0.75,37.65],[-1.3,37.55],[-1.65,37.35],[-1.9,36.95],[-2.2,36.73],[-2.8,36.7],[-3.5,36.72],[-4.4,36.72],[-4.9,36.5],[-5.35,36.15],[-5.6,36.0],[-6.0,36.3],[-6.3,36.6],[-6.4,36.8],[-6.95,37.15],[-7.4,37.2],[-7.5,37.55],[-7.25,37.95],[-7.0,38.2],[-7.3,38.45],[-7.15,38.8],[-7.0,39.05],[-7.4,39.45],[-7.0,39.65],[-7.0,39.9],[-6.85,40.25],[-6.8,40.85],[-6.9,41.0],[-6.55,41.25],[-6.2,41.6],[-6.6,41.95],[-7.2,41.88],[-7.9,41.88],[-8.2,42.05],[-8.65,42.0]]);
const ISLAS = [[[2.35,39.6],[2.7,39.95],[3.1,39.9],[3.45,39.7],[3.25,39.35],[2.95,39.35],[2.7,39.5]], [[3.8,40.0],[4.3,39.95],[4.3,39.8],[3.85,39.92]], [[1.2,38.95],[1.6,39.1],[1.55,38.85],[1.3,38.85]]].map((p) => poly(p));
const CANARIAS = [[[-18.15,27.75],[-17.9,27.85],[-17.95,27.65]], [[-17.95,28.85],[-17.75,28.8],[-17.8,28.5],[-17.9,28.6]], [[-17.35,28.15],[-17.1,28.15],[-17.2,28.0]], [[-16.9,28.6],[-16.15,28.55],[-16.35,28.35],[-16.85,28.0],[-16.9,28.35]], [[-15.8,28.15],[-15.4,28.15],[-15.4,27.8],[-15.65,27.75],[-15.85,27.95]], [[-14.5,28.75],[-13.85,28.75],[-13.9,28.2],[-14.3,28.05],[-14.5,28.1],[-14.25,28.4]], [[-13.85,29.2],[-13.4,29.2],[-13.45,28.85],[-13.85,28.9]]].map((p) => poly(p, projC));
const provXY = (e) => CANAR[e[0]] || proj(GEO[e[0] === "Madrid" ? "Madrid|" + e[1] : e[0]]);
const PERFIL = {
  noconv: { moods: ["frown", "plain", "kind"], extra: [1, 2], frases: [["NO ME CONVENCÉIS", "¿Y QUÉ VAIS A HACER DISTINTO?", "NO LO VEO"], ["DAME MÁS ARGUMENTOS", "¿Y DE DÓNDE SALE EL DINERO?"], ["BUENO… CUÉNTAME MÁS", "VALE, ESO SUENA BIEN"]] },
  triste: { moods: ["frown"], extra: [3, 4, 5], frases: [["YA NO TENGO GANAS DE NADA…", "PARA QUÉ, SI SIEMPRE GANAN ELLOS", "ME HE RENDIDO"]] },
  casi: { moods: ["plain", "kind"], extra: [1, 2, 3], frases: [["CASI ME CONVENCES", "DÉJAME PENSARLO", "NO SÉ, IGUAL SÍ"], ["VENGA, UN ÚLTIMO ARGUMENTO", "VALE, PERO EXPLÍCAMELO"]] },
  pasa: { moods: ["plain", "plain", "kind"], extra: [0, 1], frases: [["YO PASO DE POLÍTICA", "SON TODOS IGUALES", "ESTA VEZ NO VOY"], ["¿Y A MÍ QUÉ ME AFECTA?", "MI VOTO NO CUENTA"], ["HOMBRE, SI ES POR EL ALQUILER…", "VALE, IGUAL VOY"]] },
  psoe: { moods: ["plain", "plain", "kind"], extra: [1, 2], frases: [["YO VOTO PSOE, POR SI ACASO", "¿EL VOTO ÚTIL NO ES EL PSOE?"], ["¿Y SI SALE VOX?", "¿SEGURO QUE NO TIRO MI VOTO?"], ["¿EN MI PROVINCIA DECIDE EL FRENTE AMPLIO?", "VALE, ESO NO LO SABÍA"]] },
};
const PERFIL_CA = {
  noconv: [["NO EM CONVENCEU", "I QUÈ FAREU DE DIFERENT?"], ["DONA'M MÉS ARGUMENTS", "I D'ON SURTEN ELS DINERS?"], ["BÉ… EXPLICA-M'HO MÉS", "D'ACORD, AIXÒ SONA BÉ"]],
  triste: [["JA NO TINC GANES DE RES…", "PER A QUÈ, SI SEMPRE GUANYEN ELLS"]],
  casi: [["GAIREBÉ EM CONVENCES", "DEIXA'M PENSAR-HO"], ["DE MICA EN MICA S'OMPLE LA PICA…", "D'ACORD, PERÒ EXPLICA-M'HO"]],
  pasa: [["JO PASSO DE POLÍTICA", "TOTS SÓN IGUALS"], ["I A MI QUÈ M'AFECTA?", "EL MEU VOT NO COMPTA"], ["HOME, SI ÉS PEL LLOGUER…", "VAJA, POTSER HI VAIG"]],
  psoe: [["JO VOTO PSOE, PER SI DE CAS", "EL VOT ÚTIL NO ÉS EL PSOE?"], ["I SI SURT VOX?", "SEGUR QUE NO LLENÇO EL VOT?"], ["A LA MEVA PROVÍNCIA DECIDEIX EL FRENTE AMPLIO?", "D'ACORD, AIXÒ NO HO SABIA"]],
};
const PERFIL_GL = {
  noconv: [["NON ME CONVENCEDES", "E QUE IDES FACER DIFERENTE?"], ["DÁME MÁIS ARGUMENTOS", "E DE ONDE SAE O DIÑEIRO?"], ["BUENO… CÓNTAME MÁIS", "VALE, ISO SOA BEN"]],
  triste: [["XA NON TEÑO GANAS DE NADA…", "PARA QUE, SE SEMPRE GAÑAN ELES"]],
  casi: [["CASE ME CONVENCES", "DEPENDE…"], ["VENGA, UN ÚLTIMO ARGUMENTO", "VALE, PERO EXPLÍCAMO"]],
  pasa: [["EU PASO DA POLÍTICA", "SON TODOS IGUAIS"], ["E A MIN QUE ME AFECTA?", "O MEU VOTO NON CONTA"], ["HOME, SE É POLO ALUGUEIRO…", "VALE, IGUAL VOU"]],
  psoe: [["EU VOTO PSOE, POR SE ACASO", "O VOTO ÚTIL NON É O PSOE?"], ["E SE SAE VOX?", "SEGURO QUE NON TIRO O VOTO?"], ["NA MIÑA PROVINCIA DECIDE O FRENTE AMPLIO?", "VALE, ISO NON O SABÍA"]],
};
const LOCAL = {
  Barcelona: "ca", Tarragona: "ca", Baleares: "ca", "Castellón": "ca", Alicante: "ca", "A Coruña": "gl", Pontevedra: "gl",
  Sevilla: ["¡QUILLO, YO PASO DE POLÍTICA!", "ESTO ES COMO LA FERIA: SIEMPRE GANAN LOS MISMOS"], "Córdoba": ["¡QUILLO, YO PASO DE POLÍTICA!"], "Málaga": ["¡QUILLO, SON TODOS IGUALES!", "¡ILLO, YA NO ME CREO NADA!"], Granada: ["¡ILLO, SON TODOS IGUALES!"],
  "Las Palmas": ["¡MI NIÑO, SON TODOS IGUALES!", "¡CHACHO, YA NO ME CREO NADA!"], "Santa Cruz de Tenerife": ["¡CHACHO, YA NO ME CREO NADA!"],
  Madrid: ["¡QUE NO, CHAVAL, QUE SON TODOS IGUALES!", "EN MADRID SIEMPRE GANAN LOS MISMOS"], Zaragoza: ["¡QUE NO ME CONVENCES, MAÑO!"], Asturias: ["¡HO, YO PASO DE POLÍTICA!"],
  Bizkaia: ["AUPA… PERO YO PASO DE POLÍTICA", "¡ESTO NO LO ARREGLA NI DIOS, OYE!"], Navarra: ["¡QUE NO, QUE YO PASO, OYE!"],
};
const VOY = (L) => pickR(L === "ca" ? ["D'ACORD, VOTARÉ FRENTE AMPLIO!", "M'HAS CONVENÇUT!", "AU, ANEM A PENJAR CARTELLS!"] : L === "gl" ? ["VALE, VOTAREI FRENTE AMPLIO!", "CONVENCÍSTEME!", "VENGA, IMOS PEGAR CARTEIS!"] : ["¡VALE, VOTARÉ FRENTE AMPLIO!", "¡ME HAS CONVENCIDO!", "¡VENGA, VAMOS A PEGAR CARTELES!", "¡CUENTA CONMIGO EL 29N!"]);
const perfilFor = (prov) => { const L = LOCAL[prov]; if (L === "ca" || L === "gl") { const T = L === "ca" ? PERFIL_CA : PERFIL_GL; return Object.fromEntries(Object.entries(PERFIL).map(([k, v]) => [k, { ...v, frases: T[k] }])); } if (Array.isArray(L)) return Object.fromEntries(Object.entries(PERFIL).map(([k, v]) => [k, { ...v, frases: [v.frases[0].concat(L), ...v.frases.slice(1)] }])); return PERFIL; };
const NUM = (n) => n.toLocaleString("es");
const RESP = [
  [/PSOE|ÚTIL/, (t) => [`En ${t[0]} el último escaño se lo juegan el Frente Amplio y ${t[1]}. Aquí el voto útil es el Frente Amplio.`, `A ${t[0]} l'últim escó se'l juguen el Frente Amplio i ${t[1]}. Aquí el vot útil és el Frente Amplio.`, `En ${t[0]} o último escano xógano o Frente Amplio e ${t[1]}. Aquí o voto útil é o Frente Amplio.`]],
  [/VOX/, (t) => [`Cada escaño que gana el Frente Amplio aquí es uno menos para ${t[1]}.`, `Cada escó que guanya el Frente Amplio aquí és un menys per a ${t[1]}.`, `Cada escano que gaña o Frente Amplio aquí é un menos para ${t[1]}.`]],
  [/TIRO|LLENÇO/, (t) => [`En ${t[0]} solo faltan ${NUM(t[2])} votos. Tu voto no se tira: decide.`, `A ${t[0]} només falten ${NUM(t[2])} vots. El teu vot no es llença: decideix.`, `En ${t[0]} só faltan ${NUM(t[2])} votos. O teu voto non se tira: decide.`]],
  [/CONTA|COMPTA|CUENTA/, (t) => [`En ${t[0]} el escaño depende de ${NUM(t[2])} votos. Cada voto cuenta.`, `A ${t[0]} l'escó depèn de ${NUM(t[2])} vots. Cada vot compta.`, `En ${t[0]} o escano depende de ${NUM(t[2])} votos. Cada voto conta.`]],
  [/PROVÍNCIA|PROVINCIA/, (t) => [`Sí: aquí el último escaño está entre el Frente Amplio y ${t[1]}, a ${NUM(t[2])} votos.`, `Sí: aquí l'últim escó és entre el Frente Amplio i ${t[1]}, a ${NUM(t[2])} vots.`, `Si: aquí o último escano está entre o Frente Amplio e ${t[1]}, a ${NUM(t[2])} votos.`]],
  [/DINERO|DINERS|DIÑEIRO/, () => ["Del 3 % a las grandes fortunas y un 20 % mínimo real en Sociedades a las grandes empresas.", "Del 3 % a les grans fortunes i un 20 % mínim real de Societats a les grans empreses.", "Do 3 % ás grandes fortunas e un 20 % mínimo real en Sociedades ás grandes empresas."]],
  [/ALQUILER|LLOGUER|ALUGUEIRO/, () => ["Tu alquiler, como mucho el 25 % de lo que entra en casa.", "El teu lloguer, com a molt el 25 % del que entra a casa.", "O teu aluguer, como moito o 25 % do que entra na casa."]],
  [/IGUAL|CREO NADA|CUMPLIR/, () => ["PP y Vox quieren derogar la Ley de Vivienda. Nosotras, topar el alquiler. No es lo mismo.", "PP i Vox volen derogar la Llei d'Habitatge. Nosaltres, topar el lloguer. No és el mateix.", "PP e Vox queren derrogar a Lei de Vivenda. Nós, limitar o aluguer. Non é o mesmo."]],
  [/AFECTA/, () => ["Si cobras el salario mínimo: IRPF cero. Si trabajas: 32 horas con el mismo sueldo.", "Si cobres el salari mínim: IRPF zero. Si treballes: 32 hores amb el mateix sou.", "Se cobras o salario mínimo: IRPF cero. Se traballas: 32 horas co mesmo soldo."]],
  [/GANAS|GANES|RENDI|HARTA|SEMPRE|SIEMPRE|FERIA/, () => ["Cuando votamos, ganamos: 200 € al mes por cada menor y dentista en la pública.", "Quan votem, guanyem: 200 € al mes per cada menor i dentista a la pública.", "Cando votamos, gañamos: 200 € ao mes por cada menor e dentista na pública."]],
  [/POLÍTICA|PASO|PASSO|NO VOY|NO VAIG/, () => ["La política decide tu alquiler, tu sueldo y tu sanidad. Si no decides tú, deciden los de arriba.", "La política decideix el teu lloguer, el teu sou i la teva sanitat. Si no decideixes tu, decideixen els de dalt.", "A política decide o teu aluguer, o teu soldo e a túa sanidade. Se non decides ti, deciden os de arriba."]],
  [/DISTINT|DIFERENT|CONVENC|NO LO VEO/, () => ["32 horas sin bajar el sueldo y 1,5 millones de viviendas públicas.", "32 hores sense baixar el sou i 1,5 milions d'habitatges públics.", "32 horas sen baixar o soldo e 1,5 millóns de vivendas públicas."]],
];
const DEF_ARG = ["32 horas a la semana. El mismo sueldo.", "32 hores a la setmana. El mateix sou.", "32 horas á semana. O mesmo soldo."];
const answerFor = (frase, t) => { const L = LOCAL[t[0]], li = L === "ca" ? 1 : L === "gl" ? 2 : 0; const r = RESP.find(([re]) => re.test(frase)); return r ? r[1](t)[li] : li ? DEF_ARG[li] : pickR(PROG_SLOGANS)[2]; };
const FACHA = ["¡YO VOTO A VOX, ¿QUÉ PASA?!", "AQUÍ LO QUE HACE FALTA ES MANO DURA", "TODO ESO ES COMUNISMO", "¡QUE TE VOTE TU TÍA!"];
const TRISTE = ["YA NO TENGO GANAS DE NADA…", "PARA QUÉ, SI SIEMPRE GANAN ELLOS", "ESTOY HARTA…", "ME HE RENDIDO"];
const CASI = ["BUENO… PUEDE SER", "CASI ME CONVENCES", "DÉJAME PENSARLO", "NO SÉ, IGUAL SÍ", "VALE, PERO EXPLÍCAMELO"];
const DUDAS = ["¿EL VOTO ÚTIL ES EL PSOE?", "NO VAMOS A GANAR…", "TOTAL, SI DA IGUAL", "EL FRENTE AMPLIO… NO SÉ", "¿Y SI VOTO PSOE POR SI ACASO?", "SON TODOS IGUALES", "PARA QUÉ VOY A IR", "YA NO ME CREO NADA", "¿Y SI SALE VOX?", "MI VOTO NO CUENTA", "ESTA VEZ PASO", "NO SÉ NI QUIÉN SE PRESENTA", "VOTO AL MAL MENOR", "OTRA VEZ ELECCIONES…", "LA IZQUIERDA SIEMPRE SE DIVIDE", "ESO NO LO VAN A CUMPLIR"];
const EMPODERA = ["¡VOTO ÚTIL: FRENTE AMPLIO!", "¡EL VOTO ÚTIL ES EL FRENTE AMPLIO!", "¡A VOTAR EL 29N!", "¡SIN PRESIÓN NO HAY 32 HORAS!", "¡CASAS PARA VIVIR!"];
const L2_TIME = 30;
const Q_TIME = 15;
const EMPOWER_LOOK = { ...LOOKS.aliado, mood: "brave", outfit: ["teestar"], cloth: [BIEN], bg: ["#d6ecff"] };

// ---------- NIVEL 3: vivienda como derecho (5 preguntas del argumentario) ----------
const BANCO = [
  { q: "Los fondos de inversión compran edificios enteros. ¿Para quién deberían ser esas casas?", a: ["Para quien especula con ellas", "Para las familias que van a vivir en ellas"], ok: 1, fa: "Prohibir la compra especulativa de vivienda por fondos de inversión, bancos e inmobiliarias con ánimo de lucro." },
  { q: "En un barrio tensionado, ¿cuánto debería poder costar como máximo el alquiler?", a: ["Lo que quiera el propietario", "No más del 25 % de la renta media de los hogares del barrio"], ok: 1, fa: "Bajar los alquileres: limitar los precios en zonas tensionadas al 25 % de la renta media del barrio." },
  { q: "Pisos turísticos en edificios de vecinos de zonas tensionadas. ¿Qué hacemos?", a: ["Eliminarlos progresivamente, en un máximo de tres años", "Dar más licencias, que da dinero"], ok: 0, fa: "Eliminar progresivamente los pisos turísticos de los edificios residenciales en zonas tensionadas en un máximo de tres años." },
  { q: "¿Cómo deberían ser los contratos de alquiler?", a: ["Cortos, para subir el precio cada poco", "Indefinidos como norma general"], ok: 1, fa: "Contratos de alquiler indefinidos como norma general, para dar estabilidad a las familias." },
  { q: "Una familia vulnerable no puede pagar y no tiene adónde ir. ¿Qué pasa?", a: ["Ningún desahucio sin alternativa habitacional", "A la calle, que la ley es la ley"], ok: 0, fa: "Ningún desahucio de personas vulnerables sin alternativa habitacional, y 1,5 millones de viviendas públicas." },

  { q: "¿Cuántas horas a la semana deberíamos trabajar como máximo?", a: ["Las que diga la empresa", "32 horas, sin bajar el sueldo"], ok: 1, fa: "Jornada máxima de 32 horas semanales sin reducción salarial, empezando ya por las 37,5." },
  { q: "¿Cuánto IRPF debería pagar quien cobra el salario mínimo?", a: ["Cero", "Lo mismo que cualquiera"], ok: 0, fa: "IRPF cero para quien cobre el salario mínimo y SMI blindado en el 60 % del salario medio." },
  { q: "Un algoritmo decide despedirte. ¿Qué debería pasar?", a: ["Revisión humana obligatoria y acceso sindical al algoritmo", "Nada, la máquina no se equivoca"], ok: 0, fa: "Revisión humana de cualquier despido decidido por algoritmos y auditorías independientes." },
  { q: "¿Cómo debería ser la sanidad?", a: ["Cada vez más privatizada", "100 % pública y de gestión directa"], ok: 1, fa: "Sanidad 100 % pública, con un suelo del 8 % del PIB y salud dental, visual y auditiva incluidas." },
  { q: "¿Quién debería pagar la educación de 0 años a la universidad?", a: ["Cada familia, como pueda", "Lo público: gratuita en todas las etapas"], ok: 1, fa: "Gratuidad desde los 0 años hasta la universidad y un suelo del 7 % del PIB en 2030." },
  { q: "Las grandes corporaciones pagan un tipo efectivo bajísimo. ¿Qué hacemos?", a: ["Un tipo mínimo real del 20 % en Sociedades", "Bajarlo más, que se van"], ok: 0, fa: "Tipo mínimo real del 20 % en el Impuesto de Sociedades para las grandes corporaciones." },
  { q: "¿Cómo deberían tributar las rentas del capital?", a: ["Menos que el trabajo", "Igual que las del trabajo"], ok: 1, fa: "Que las rentas del capital tributen igual que las del trabajo." },
  { q: "Una herencia de 200 millones. ¿Cuánto puede recibir cada heredero?", a: ["Todo, sin límite", "Hasta 10 millones; lo de encima, al común"], ok: 1, fa: "Límite de 10 millones por heredero en las grandes herencias, con un tipo del 100 % por encima." },
  { q: "¿Cuánto debería ayudar el Estado por cada criatura?", a: ["200 € al mes por menor", "Nada, que se apañen"], ok: 0, fa: "Prestación Universal por Crianza de 200 € al mes por menor para acabar con la pobreza infantil." },
  { q: "Te jubilas tras más de 40 años cotizados, sin quererlo. ¿Te recortan la pensión?", a: ["Sí, coeficientes reductores", "No: fin de los recortes para largas carreras"], ok: 1, fa: "Fin de los coeficientes reductores para quien cotizó más de 40 años y pensiones revalorizadas por mandato constitucional." },
  { q: "¿Cómo debería ser el transporte público?", a: ["Abono único estatal y tren público para todo el territorio", "Que lo gestione quien más gane con él"], ok: 0, fa: "Abono único estatal de transporte y un tren público al servicio de los territorios." },
  { q: "¿Y si hubiera banca pública en las oficinas de Correos?", a: ["Mejor cerrar más oficinas", "Sí: Banco Postal en todo el territorio"], ok: 1, fa: "Banca pública con red en Correos (Banco Postal) para garantizar servicios en todo el territorio." },
  { q: "¿Desde qué edad se debería poder votar?", a: ["Desde los 16 años", "Desde los 21, como antes"], ok: 0, fa: "Derecho a votar desde los 16 años, reconocido por ley." },
  { q: "¿Qué hacemos con la Ley Mordaza?", a: ["Derogarla entera", "Endurecerla"], ok: 0, fa: "Derogación completa de la Ley Mordaza." },
  { q: "¿De quién debería ser el agua?", a: ["Un bien público, para el interés común", "De quien pueda hacer negocio"], ok: 0, fa: "El agua como bien público, gestionada para el interés común y no para el negocio." },
  { q: "¿Qué hacemos con el IVA de lo básico y la energía?", a: ["Bajarlo, y subir la fiscalidad del lujo", "Subirlo a todo el mundo por igual"], ok: 0, fa: "Bajar el IVA de bienes básicos y energía, y subir la fiscalidad sobre el lujo." },
];
const PROG_SLOGANS = [["", "Vivienda", "1,5 millones de viviendas públicas. Para vivir, no para especular."],["", "Vivienda", "El 1 % del PIB cada año para vivienda pública."],["", "Alquiler", "Tu alquiler, como mucho el 25 % de lo que entra en casa."],["", "Pisos turísticos", "3 años para sacar los pisos turísticos de los edificios de vecinos."],["", "Fondos buitre", "Alquiler social de 7 años antes de cualquier desalojo."],["", "Desahucios", "Ni un desahucio sin alternativa habitacional."],["", "Derecho a techo", "La vivienda, un derecho exigible ante los tribunales."],["", "Trabajo", "32 horas a la semana. El mismo sueldo."],["", "Trabajo", "Ya mismo, 37,5 horas. Y a por las 32."],["", "Salario", "Salario mínimo blindado en el 60 % del salario medio."],["", "Salario", "IRPF cero para quien cobra el salario mínimo."],["", "Algoritmos", "Ningún despido decidido por una máquina sin revisión humana."],["", "Pensiones", "Más de 40 años cotizados: ni un euro de recorte."],["", "Cuidados", "Dependencia: del 0,8 % al 1,7 % del PIB en 2030."],["", "Crianza", "200 € al mes por cada menor. Pobreza infantil cero."],["", "Sanidad", "Sanidad 100 % pública, con un suelo del 8 % del PIB."],["", "Sanidad", "Dentista, gafas y audífonos en la sanidad pública."],["", "Salud mental", "10 profesionales de salud mental por cada 100.000 habitantes."],["", "Educación", "Un 7 % del PIB para educación en 2030."],["", "Educación", "Gratis desde los 0 años hasta la universidad."],["", "Democracia", "A votar desde los 16 años."],["", "Impuestos", "Las grandes empresas, un 20 % mínimo real. Sin trampas."],["", "Herencias", "Herencias: hasta 10 millones por heredero. Lo de encima, para todas."],["", "Impuestos", "Las rentas del capital, igual que las del trabajo."],["", "IVA", "Menos IVA en lo básico y la luz. Más en el lujo."],["", "Transporte", "Un abono único para todo el Estado."],["", "Banca pública", "Banca pública en las oficinas de Correos."],["", "Agua", "El agua, bien público. No negocio."],["", "Libertades", "Ley Mordaza: derogación completa."],["", "Paz", "Menos gasto militar, más hospitales."],["", "Videojuegos", "Fuera las cajas de recompensa de los videojuegos."],["", "Empresas", "Las plantillas, en los consejos de administración."]];
const CURRA = ["¡Es currante, es tu compañer@!", "¡No te confundas!", "¡Que es de los tuyos!", "¡Esa es tu vecina!", "¡Ese currela no!", "¡A tu compa no!", "¡Ojo, que es del barrio!"];
const SVGW = (inner, bg) => `<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="${bg}"/>${inner}</svg>`;
const LUGARES = [
  ["En el curro", SVGW('<rect y="88" width="200" height="32" fill="#cfe3a8"/><g class="drift"><path d="M8 88 V60 l14 -10 v10 l14 -10 v10 l14 -10 v38 Z" fill="#e2d8c8"/><rect x="40" y="30" width="7" height="30" fill="#d6cab6"/></g><g class="smoke" fill="#e9e4dc"><circle cx="43.5" cy="24" r="5"/><circle cx="48" cy="16" r="6"/><circle cx="54" cy="8" r="7"/></g><rect x="70" y="44" width="62" height="44" fill="#ece5d8"/><g fill="#fff">' + [76, 92, 108, 120].map((x) => `<rect x="${x}" y="52" width="9" height="11"/><rect x="${x}" y="70" width="9" height="11"/>`).join("") + '</g><g class="blink2"><rect x="146" y="56" width="26" height="17" rx="2" fill="#3a3a3a"/><rect x="148" y="58" width="22" height="13" fill="#bfe1ff"/><rect x="156" y="73" width="6" height="5" fill="#3a3a3a"/></g><g fill="#a9c97a"><path d="M176 88 q6 -18 12 0"/><path d="M186 88 q5 -14 10 0"/></g><g stroke="#e6c55a" stroke-width="2"><line x1="0" y1="104" x2="200" y2="104" stroke-dasharray="10 8" class="road"/></g>', "#fbf4e8")],
  ["En las redes", SVGW('<g class="float1"><rect x="14" y="16" width="56" height="16" rx="8" fill="#fff" stroke="#d8d2e8"/><rect x="20" y="22" width="40" height="4" rx="2" fill="#ddd6ef"/></g><g class="float2"><rect x="128" y="22" width="60" height="16" rx="8" fill="#c6f432" opacity=".55"/><rect x="134" y="28" width="44" height="4" rx="2" fill="#fff"/></g><g class="float1"><rect x="120" y="76" width="64" height="16" rx="8" fill="#fff" stroke="#d8d2e8"/><rect x="126" y="82" width="46" height="4" rx="2" fill="#ddd6ef"/></g><g class="float2"><rect x="10" y="80" width="50" height="16" rx="8" fill="#e8452c" opacity=".25"/></g><g stroke="#cfc6e8" stroke-width="1.2" fill="#e9e4f6"><line x1="80" y1="50" x2="100" y2="40"/><line x1="100" y1="40" x2="118" y2="54"/><line x1="80" y1="50" x2="96" y2="66"/><line x1="96" y1="66" x2="118" y2="54"/><circle cx="80" cy="50" r="4"/><circle cx="100" cy="40" r="4"/><circle cx="118" cy="54" r="4"/><circle cx="96" cy="66" r="4"/></g>', "#f4f2fb")],
  ["Con mis amigos", SVGW('<rect y="92" width="200" height="28" fill="#e9d9c2"/><g class="sway"><rect x="20" y="40" width="70" height="8" rx="2" fill="#c96a3d"/><path d="M22 40 L55 22 L88 40 Z" fill="#e8452c" opacity=".8"/></g><rect x="30" y="72" width="50" height="5" rx="2" fill="#a67852"/><rect x="34" y="77" width="4" height="15" fill="#a67852"/><rect x="72" y="77" width="4" height="15" fill="#a67852"/><g fill="#fff" stroke="#d3c2a8"><rect x="40" y="64" width="6" height="8" rx="1"/><rect x="52" y="64" width="6" height="8" rx="1"/><rect x="64" y="64" width="6" height="8" rx="1"/></g><g class="lights">' + Array.from({ length: 10 }, (_, i) => `<circle cx="${110 + i * 9}" cy="${22 + Math.sin(i) * 4}" r="2.4" fill="${["#c6f432", "#ffd25a", "#e8452c"][i % 3]}"/>`).join("") + '</g><path d="M106 20 q45 14 92 0" stroke="#8a7a66" fill="none"/><circle cx="160" cy="70" r="14" fill="#fff" stroke="#d3c2a8"/><path d="M152 70 h16" stroke="#e8452c" stroke-width="2"/>', "#fbf1e2")],
  ["En el barrio", SVGW('<g fill="#e7dccb"><rect x="0" y="30" width="38" height="62"/><rect x="42" y="14" width="34" height="78"/><rect x="128" y="22" width="40" height="70"/><rect x="172" y="40" width="28" height="52"/></g><g fill="#fff">' + Array.from({ length: 12 }, (_, i) => `<rect x="${[6,20,48,60,134,150][i % 6]}" y="${[40,58][Math.floor(i / 6)] + (i % 6 > 1 && i % 6 < 4 ? -14 : 0)}" width="8" height="10" rx="1"/>`).join("") + '</g><g class="banner"><path d="M76 34 L128 40 L128 50 L76 44 Z" fill="#c6f432"/></g><rect y="92" width="200" height="28" fill="#d6d0c4"/><rect y="90" width="200" height="3" fill="#bdb5a6"/><g fill="#7da35a"><circle cx="100" cy="70" r="12"/><rect x="98" y="78" width="4" height="14" fill="#8a6a4a"/></g><g class="road"><rect x="0" y="104" width="14" height="3" fill="#fff"/><rect x="40" y="104" width="14" height="3" fill="#fff"/><rect x="80" y="104" width="14" height="3" fill="#fff"/><rect x="120" y="104" width="14" height="3" fill="#fff"/><rect x="160" y="104" width="14" height="3" fill="#fff"/></g>', "#f7efe3")],
];
let HDECK = [];
const draw3 = () => { if (HDECK.length < 3) HDECK = PROG_SLOGANS.map((x) => x[2]).sort(() => Math.random() - 0.5); return HDECK.splice(0, 3); };
const PRAISE = ["¡Muy bien! ¡Tú sí que sabes tasar!", "¡Así se reparte la riqueza!", "¡Hacienda somos todas!", "¡Qué reflejos fiscales!", "¡Ni un euro sin tasar!"];
const IDLE_FR = ["Bah… qué aburrimiento", "Total, para qué", "Siempre ganan los mismos…", "El alquiler otra vez por las nubes", "No llego a fin de mes", "Nadie me escucha…", "A ver si cambia algo…"];
const FALLO = [
  "¡Esa es la respuesta de los de arriba! Prueba otra vez.",
  "Uy, eso lo firmaría un fondo buitre. Otra vez.",
  "Esa respuesta es para aficionados a la ornitología: les encanta el aguilucho. Prueba otra.",
  "Con esa respuesta te invitan a una gala en un yate. Otra vez.",
  "Eso se lo has copiado a un consejo de administración. Prueba otra.",
  "¡Frío, frío! Esa te la aplaudirían en Marbella. Otra vez.",
  "Esa respuesta cotiza en el IBEX. Prueba otra.",
  "Así contesta quien tiene 14 pisos turísticos. Otra vez.",
];
const mobileNow = () => typeof window !== "undefined" && window.innerWidth < 760;
const NUMF = (n) => n.toLocaleString("es");
const ESPECIALES = [
  { k: "desen", w: 4, tag: "DESENCANTADA", ring: "#8a8f98", need: 3, dudas: ["LA IZQUIERDA, SIEMPRE PELEADA…", "¿ADA COLAU? NI IDEA", "¿Y ESTA VEZ VA EN SERIO?"], args: [(t) => "Esta vez, una sola papeleta.", (t) => "La de la PAH. La que paró desahucios.", (t) => "32 horas y alquiler topado. En serio."] },
  { k: "desen2", w: 3, tag: "INDECISO", ring: "#8a8f98", need: 2, dudas: ["TOTAL, GANAN SIEMPRE LOS MISMOS", "¿Y MI VOTO QUÉ CAMBIA?"], args: [(t) => `Aquí faltan solo ${NUMF(t[2])} votos.`, (t) => `Le quita un escaño a ${t[1]}.`] },
  { k: "psoe", w: 3, tag: "VOTANTE DEL PSOE", ring: "#e30613", need: 2, dudas: ["EL PSOE GOBIERNA SOLO", "¿PARA QUÉ OTRO PARTIDO?"], args: [(t) => "Solo no suma. Sin nosotras, no hay gobierno.", (t) => `Aquí el escaño se lo quitamos a ${t[1]}.`] },
  { k: "podemos", w: 2, tag: "VOTANTE DE PODEMOS", ring: "#6b2d8c", need: 2, dudas: ["YO VOTO PODEMOS, AUNQUE NO SAQUE", "¿Y SI NOS VOLVEMOS A DIVIDIR?"], args: [(t) => `En ${t[0]} ese voto no llega a escaño.`, (t) => "Mismas luchas, una papeleta."] },
  { k: "erc", w: 1, tag: "VOTANT D'ERC", ring: "#f5b700", where: ["Barcelona", "Tarragona"], need: 2, dudas: ["VAM ESCRIURE EL LLIBRE ANTIFATXES", "JA TINC EL MEU PARTIT…"], args: [(t) => "Els llibres no aturen Vox. Els escons, sí.", (t) => "Puja al tren del Frente Amplio."] },
  { k: "junts", w: 1, tag: "VOTANT DE JUNTS", ring: "#20b2a6", where: ["Barcelona", "Tarragona"], block: true, dudas: ["AMB PP I VOX, EL QUE CALGUI"], note: "Vota con PP y Vox. Solo se mueve con «peixet». Siguiente." },
];
const ANIMOS = ["¡Va, que lo consigues!", "¡Ánimo, tú puedes!", "¡A por ellos!", "¡Ya casi está!", "¡No pares ahora!", "¡Sí se puede!", "¡Que no se escape!", "¡Dale, dale!", "¡Lo tienes ahí!", "¡Cada voto cuenta!"];
const PEEK = [["t", 22], ["t", 50], ["t", 78], ["b", 22], ["b", 50], ["b", 78], ["l", 30], ["l", 70], ["r", 50]];
const MED_HUCHA = [
  "Casas para vivir, no para especular",
  "Alquileres que se puedan pagar",
  "Ni un desahucio sin alternativa",
  "Que ningún niño crezca en la pobreza",
  "Sanidad 100 % pública",
  "Dentista y gafas en la pública",
  "Educación gratis de 0 años a la universidad",
  "Un abono para moverte por todo el país",
  "Que nadie pase frío ni calor en casa",
  "Cuidar a quien nos cuidó",
  "Salud mental pública y cerca",
  "Trabajar 32 horas, cobrar lo mismo",
  "Cero IRPF para el salario mínimo",
  "Banca pública en cada pueblo",
  "El agua, de todas",
  "Energía limpia y pública",
  "Servicios en toda la España vaciada",
];
let L3N = 0;
const pick5 = () => { if (L3N++ === 0) return BANCO.slice(0, 5); const a = [...BANCO]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, 5); };
let PREGUNTAS = BANCO.slice(0, 5);

// =====================================================================
export default function TomaTasa() {
  const [phase, setPhase] = useState(() => (typeof location !== "undefined" && location.hash === "#fin" ? "end" : typeof location !== "undefined" && location.hash === "#mapa" ? "pick" : "start")); // start | l1 | r1 | l2 | r2 | l3 | end
  const [muted, setMuted] = useState(false);
  const [drop, setDrop] = useState(0);
  const [intro, setIntro] = useState(null);
  const LVL = [["Toca a los megarricos cuando se asomen", "Si eres rápida, tasas doble o triple. A la gente currante, no: pierdes tiempo."], ["Arrebata escaños a la derecha", "Toca a quien duda: dale la papeleta del voto útil"], [L3N <= 1 ? "Haz de la vivienda un derecho" : "Construye el país de la mayoría", "5 preguntas rápidas"]];
  const showIntro = (n) => { setIntro(n); setTimeout(() => setIntro(null), 3200); };
  useEffect(() => { const ts = [setTimeout(() => Music.fx("thud"), 380), setTimeout(() => Music.fx("thud"), 1080)]; return () => ts.forEach(clearTimeout); }, [drop]);
  useEffect(() => { const t = 0; const first = () => { if (!window.__thud) { window.__thud = 1; Music.fx("thud"); } }; window.addEventListener("pointerdown", first, { once: true, capture: true }); return () => { clearTimeout(t); window.removeEventListener("pointerdown", first, true); }; }, []);
  const [nopress, setNopress] = useState(null);
  // N1
  const [holes, setHoles] = useState(Array(9).fill(null));
  const [left, setLeft] = useState(L1_TIME);
  const [hucha, setHucha] = useState(0);
  const [tasados, setTasados] = useState([]);
  const [showList, setShowList] = useState(false);
  const [flash, setFlash] = useState(null);
  // N2
  const [crowd, setCrowd] = useState([]);
  const [prov, setProv] = useState(0);
  const [provOrder, setProvOrder] = useState(ESCANOS.map((_, i) => i));
  const [votos, setVotos] = useState(0);
  const [seats, setSeats] = useState([]);
  const [rays, setRays] = useState([]);
  const [seatBanner, setSeatBanner] = useState(null);
  // N3
  const [qi, setQi] = useState(0);
  const [medR1, setMedR1] = useState([]);
  const [cd, setCd] = useState(10);
  const [showRank, setShowRank] = useState(false);
  const [reward, setReward] = useState(null);
  const [pickInfo, setPickInfo] = useState(null);
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 760);
  useEffect(() => { const f = () => setMobile(window.innerWidth < 760); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const [rankBy, setRankBy] = useState("hucha");
  const [endBg, setEndBg] = useState(0);
  const [place, setPlace] = useState(0);
  const [splash, setSplash] = useState(false);
  const [dato, setDato] = useState(null);
  const [walkTo, setWalkTo] = useState(null);
  const [idleMood, setIdleMood] = useState(0);
  const [idleHint, setIdleHint] = useState(null);
  useEffect(() => { if (phase !== "pick") return; const t = setInterval(() => setIdleMood((m) => (m + 1) % IDLE_FR.length), 3500); return () => clearInterval(t); }, [phase]);
  const [wrong, setWrong] = useState(null);
  const [firstTry, setFirstTry] = useState(0);
  const [qOk, setQOk] = useState(null);
  // ranking
  const [nick, setNick] = useState(() => { try { return localStorage.getItem("aquiestan.nick") || ""; } catch (e) { return ""; } });
  const [board, setBoard] = useState([]); const [dbOk, setDbOk] = useState(null); const [saved, setSaved] = useState(false);
  const dbRef = useRef(null), uidRef = useRef(null), holesRef = useRef(holes); holesRef.current = holes;
  const leftRef = useRef(left); leftRef.current = left;

  useEffect(() => { Music.setMuted(muted); }, [muted]);
  useEffect(() => () => Music.stop(), []);
  useEffect(() => {
    let unsub = null, alive = true;
    (async () => { try {
      const use = window.claude && window.claude.use; const db = use ? await use("db") : null; const user = use ? await use("user") : null;
      if (!alive) return; if (!db) { setDbOk(false); return; } dbRef.current = db; uidRef.current = user ? await user.id() : null;
      unsub = db.collection("scores").orderBy("score", "desc").limit(300).onSnapshot((s) => { setBoard(s.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }))); setDbOk(true); }, () => setDbOk(false));
    } catch (e) { setDbOk(false); } })();
    return () => { alive = false; if (unsub) unsub(); };
  }, []);

  // reloj común a N1 y N2
  const timed = (phase === "l1" || phase === "l2") && !intro && !seatBanner && !reward;
  useEffect(() => { if (!timed) return; const t = setInterval(() => setLeft((v) => v - 1), phase === "l2" ? Math.max(450, 1000 - seats.length * 90) : 1000); return () => clearInterval(t); }, [timed, seats.length]);
  useEffect(() => { if (!timed) return; if (left === 10 && phase === "l1") Music.fx("alarm"); if (left <= 5 && left > 0) Music.fx("tick"); if (left <= 0) { Music.stop(); Music.fx("win"); setShowList(false); setPhase(phase === "l1" ? "r1" : "r2"); } }, [left]);

  // ---- N1 ----
  const splashThen = (txt, fn) => { if (splash) return; setSplash(txt); Music.fx("thud"); setTimeout(() => { setSplash(false); fn(); }, txt[0].length > 14 ? 2800 : 1700); };
  const startL1 = () => startL1b();
  const startL1b = () => { missRef.current = 0; setMedR1(draw3()); setHoles(Array(9).fill(null)); setLeft(L1_TIME); setHucha(0); setTasados([]); setPhase("l1"); Music.start(0); };
  useEffect(() => {
    if (phase !== "l1" || intro) return; let alive = true;
    const spawn = () => {
      if (!alive) return; const el = L1_TIME - leftRef.current;
      const free = holesRef.current.map((h, i) => (h ? -1 : i)).filter((i) => i >= 0);
      if (free.length) {
        const i = pickR(free), rich = Math.random() < 0.62, k = Math.random();
        const R0 = rich ? pickR(RICOS) : null, name = R0 && R0[0], fortune = R0 && R0[2], look = rich ? (() => { let hh = hash(R0[0]); const n = () => (hh = Math.imul(hh ^ (hh >>> 13), 2654435761) >>> 0); return makeLook(LOOKS.rico, n, R0[1], false); })() : crowdLook(rng(Math.floor(k * 1e9)));
        setHoles((hs) => { const n = hs.slice(); n[i] = { rich, name, fortune, look, k, t0: Date.now(), jx: (Math.random() - 0.5) * 12, jy: (Math.random() - 0.5) * 10, sz: 0.75 + Math.random() * 0.55, gr: Math.random() < 0.5 ? 1.25 : 0.8 }; return n; });
        setTimeout(() => setHoles((hs) => (hs[i] && hs[i].k === k ? Object.assign(hs.slice(), { [i]: null }) : hs)), Math.max(1100, 2800 - el * 60));
      }
      setTimeout(spawn, Math.max(380, 900 - el * 18));
    };
    spawn(); return () => { alive = false; };
  }, [phase, intro]);
  useEffect(() => { if (!((phase === "r1" && hucha > 0) || (phase === "r2" && seats.length > 0))) return; setCd(10); [0, 1, 2].forEach((n) => setTimeout(() => Music.fx("thudsoft"), 900 + n * 700)); const t = setInterval(() => setCd((c) => c - 1), 1000); return () => clearInterval(t); }, [phase]);
  useEffect(() => { if (cd > 0) return; if (phase === "r1" && hucha > 0) startL2(); else if (phase === "r2" && seats.length > 0) startL3(); }, [cd]);
  const [plus, setPlus] = useState(null);
  const missRef = useRef(0);
  const pendRef = useRef(0);
  const qT0 = useRef(0);
  const qiRef = useRef(0);
  const [qLeft, setQLeft] = useState(15);
  const contRef = useRef(false);
  const effRef = useRef(1);
  const [wrongMsg, setWrongMsg] = useState("");
  const usedArgs = useRef(new Set());
  const usedEsp = useRef(new Set());
  const usedDud = useRef(new Set());
  const endedRef = useRef(false);
  const spamRef = useRef([]);
  const jokeRef = useRef(0);
  const [joke, setJoke] = useState(null);
  const lastTapRef = useRef(0);
  const [idle, setIdle] = useState(false);
  const deckRef = useRef([]);
  useEffect(() => { if (!(phase === "l1" && timed)) { setIdle(false); return; } lastTapRef.current = Date.now(); const t = setInterval(() => { if (Date.now() - lastTapRef.current > 2000) setIdle(true); }, 300); return () => clearInterval(t); }, [phase, timed]);
  const tapL1 = (i) => {
    const h = holes[i]; if (phase !== "l1") return; lastTapRef.current = Date.now(); setIdle(false); if (h && h.rich) { const now = Date.now(); spamRef.current = spamRef.current.filter((t) => now - t < 2500).concat(now); if (spamRef.current.length >= 6 && now - jokeRef.current > 9000) { jokeRef.current = now; setJoke("¡TAMPOCO TE PASES!!"); setTimeout(() => setJoke(null), 1800); } } if (!h || h.hit) return;
    setHoles((hs) => Object.assign(hs.slice(), { [i]: { ...h, hit: true } }));
    setTimeout(() => setHoles((hs) => (hs[i] && hs[i].k === h.k ? Object.assign(hs.slice(), { [i]: null }) : hs)), 600);
    if (h.rich) {
      Music.fx("tasa"); setTimeout(() => Music.fx("coin"), 120);
      const dt = Date.now() - (h.t0 || 0), x = dt < 550 ? 3 : dt < 1000 ? 2 : 1; const m = Math.round(h.fortune * 0.03) * x; if (x > 1) setTimeout(() => Music.fx("coin"), 260);
      setHucha((x) => x + m); setTasados((t) => [...t, { name: h.name, look: h.look, m, fortune: h.fortune }]);
      setFlash({ k: h.k, i, m, x, praise: pickR(PRAISE) }); if (x === 3) { setTimeout(() => Music.fx("coin"), 380); setTimeout(() => Music.fx("thud"), 60); }
      setTimeout(() => setFlash((f) => (f && f.k === h.k ? null : f)), 1200);
    } else { Music.fx("miss"); const pen = Math.min(5, 1 + missRef.current); missRef.current += 1; setLeft((v) => Math.max(1, v - pen)); setFlash({ k: h.k, i, bad: true, pen, txt: pickR(CURRA) }); setTimeout(() => setFlash((f) => (f && f.k === h.k ? null : f)), 1300); }
  };
  // reparto de la hucha entre servicios (para la pantalla de resultados)
  const reparto = SERVICIOS.map((s, i) => [s, Math.round((hucha * [0.24, 0.22, 0.14, 0.12, 0.1, 0.08, 0.05, 0.05][i]))]);

  // ---- N2 ----
  const newCrowd = (pn) => { const r = rng(Math.floor(Math.random() * 1e9)); if (Math.random() < 0.15) return [{ i: 0, k: Math.random(), x: mobileNow() ? 50 : 25, y: mobileNow() ? 30 : 58, look: { ...crowdLook(r), mood: "smirk" }, kind: "facha", step: 0, t0: Date.now(), state: "facha", duda: pickR(FACHA) }]; const tt = pn || target; const X = mobileNow() ? 50 : 25, Y = mobileNow() ? 30 : 58; if (Math.random() < 0.7) { const pool = ESPECIALES.filter((e) => (!e.where || e.where.includes(tt[0])) && !usedEsp.current.has(e.k)); if (pool.length) { const e = (() => { let r0 = Math.random() * pool.reduce((a, q) => a + q.w, 0); for (const q of pool) { r0 -= q.w; if (r0 <= 0) return q; } return pool[0]; })(); usedEsp.current.add(e.k); const base = { i: 0, k: Math.random(), x: X, y: Y, look: { ...crowdLook(r), mood: e.block ? "smirk" : "frown" }, tag: e.tag, ring: e.ring, t0: Date.now(), duda: e.dudas[0] }; return [e.block ? { ...base, state: "facha", note: e.note } : { ...base, state: "duda", kind: "esp", esp: e.k, step: 0, need: e.need, extra: 2, arg: e.args[0](tt) }]; } } const PF = perfilFor(tt[0]); let kind, P, frase, arg; for (let q = 0; q < 40; q++) { kind = pickR(Object.keys(PF)); P = PF[kind]; frase = pickR(P.frases[0]); arg = answerFor(frase, tt); if (!usedArgs.current.has(arg) && !usedDud.current.has(frase)) break; } usedArgs.current.add(arg); usedDud.current.add(frase); const look = crowdLook(r); return [{ i: 0, k: Math.random(), x: mobileNow() ? 50 : 25, y: mobileNow() ? 30 : 58, look: { ...look, mood: P.moods[0] }, kind, step: 0, need: pickR([1, 1, 2, 2, 3, 4]), t0: Date.now(), state: "duda", duda: frase, arg, extra: P.extra[Math.floor(Math.random() * P.extra.length)] }]; };
  const startL2 = () => splashThen(["¡EL 29N", "DECIDIMOS!"], startL2a);
  const startL2a = () => { contRef.current = false; setProvOrder(ESCANOS.map((_, i) => i).sort(() => Math.random() - 0.5)); setPhase("pick"); Music.fx("thudsoft"); Music.start(3); };
  const goL2 = (pi) => { if (walkTo) return; const [wx, wy] = provXY(ESCANOS[pi]); setWalkTo([wx, wy]); Music.fx("thudsoft"); setTimeout(() => { setWalkTo(null); goL2go(pi); }, 2200); };
  const goL2go = (pi) => { pendRef.current = pi; setProvOrder((po) => [pi, ...po.filter((x) => x !== pi)]); startL2b(); };
  const startL2b = () => { effRef.current = pickR([0.4, 0.6, 1, 1.4, 2]); setPlace(Math.floor(Math.random() * LUGARES.length)); if (!contRef.current) { setLeft(L2_TIME); setSeats([]); } contRef.current = false; setProv(0); setVotos(0); usedArgs.current = new Set(); usedEsp.current = new Set(); usedDud.current = new Set(); setCrowd(newCrowd(ESCANOS[pendRef.current])); setPhase("l2"); Music.start(1); };
  const target = ESCANOS[provOrder[prov % ESCANOS.length]];
  const units = Math.max(1, Math.round((target[2] / 4000) * effRef.current)); const perVote = Math.ceil(target[2] / units);
  useEffect(() => { if (!reward) return; Music.fx("fanfare"); const t = setTimeout(() => setReward(null), reward.type === "all" ? 7000 : 5500); return () => clearTimeout(t); }, [reward]);
  const nextProv = () => { setSeatBanner(null); contRef.current = true; setVotos(0); setPhase("pick"); };
  const goHome = () => { setSeatBanner(null); Music.stop(); Music.fx("win"); setShowList(false); setPhase("r2"); };
  useEffect(() => { qiRef.current = qi; if (phase === "l3") { qT0.current = Date.now(); setQLeft(Q_TIME); } }, [qi, phase]);
  useEffect(() => { if (phase !== "l3" || qOk !== null || splash) return; const t = setInterval(() => setQLeft((v) => v - 1), 1000); return () => clearInterval(t); }, [phase, qOk, qi, splash]);
  useEffect(() => { if (phase !== "l3" || qOk !== null) return; if (qLeft <= 5 && qLeft > 0) Music.fx("tick"); if (qLeft <= 0) { Music.fx("wrong"); setWrong(-1); setWrongMsg("¡Se acabó el tiempo! Esta era la buena:"); setQOk(true); setTimeout(advQ, 3800); } }, [qLeft]);
  const tapL2 = (idx) => {
    if (phase !== "l2" || seatBanner) return; const c = crowd[idx]; if (c && c.state === "facha") { if (Date.now() - (c.t0 || 0) < 1500) return; Music.fx("miss"); setLeft((l) => Math.max(1, l - 3)); setCrowd((cs) => Object.assign(cs.slice(), { [idx]: { ...cs[idx], duda: "¡NI LO INTENTES!" } })); return; } if (!c || c.state !== "duda") return;
    const PF = perfilFor(target[0]), P = PF[c.kind], step = c.step + 1, E = c.esp && ESPECIALES.find((e) => e.k === c.esp); if (Date.now() - (c.t0 || 0) < 1300) return;
    setRays((r) => [...r, { k: Math.random(), idx }]); 
    if (step >= c.need) {
      Music.fx("ray"); const n = 1 + (c.extra || 0);
      setCrowd((cs) => Object.assign(cs.slice(), { [idx]: { ...cs[idx], state: "power", look: { ...cs[idx].look, mood: "brave" }, msg: VOY(LOCAL[target[0]]), mult: n } }));
      setVotos((v) => v + perVote * n); setLeft((l) => l + 2 * n); setPlus(Math.random());
    } else if (E) { Music.fx("tick"); const moods = ["frown", "plain", "kind"]; setCrowd((cs) => Object.assign(cs.slice(), { [idx]: { ...cs[idx], step, t0: Date.now(), look: { ...cs[idx].look, mood: moods[Math.min(2, step)] }, duda: E.dudas[step], arg: E.args[step](target) } })); } else { Music.fx("tick"); const all = Object.values(PF).flatMap((x) => x.frases.flat()); let fr, ar; for (let q = 0; q < 60; q++) { fr = pickR(all); ar = answerFor(fr, target); if (!usedArgs.current.has(ar) && !usedDud.current.has(fr)) break; } usedArgs.current.add(ar); usedDud.current.add(fr); const moods = ["frown", "plain", "plain", "kind", "kind"]; setCrowd((cs) => Object.assign(cs.slice(), { [idx]: { ...cs[idx], step, t0: Date.now(), look: { ...cs[idx].look, mood: moods[Math.min(4, Math.round((step / c.need) * 4))] }, duda: fr, arg: ar } })); }
  };
  useEffect(() => {
    if (phase !== "l2" || votos < target[2] || seatBanner) return;
    Music.fx("win"); const s = { prov: target[0], rival: target[1], retain: target[3], votos: target[2] }; setSeats((x) => { const nx = [...x, s]; if (nx.length === ESCANOS.length) setTimeout(() => setReward({ type: "all", list: nx }), 600); else if (nx.length % 3 === 0) setTimeout(() => setReward({ type: "card", list: nx }), 600); return nx; }); setSeatBanner(s); setLeft((l) => l + 10); setPlus(Math.random());

  }, [votos]);
  useEffect(() => { if (phase !== "l2" || seatBanner || !crowd.length || crowd.some((c) => c.state === "duda" || c.state === "facha")) return; const t = setTimeout(() => setCrowd(newCrowd()), 2200); return () => clearTimeout(t); }, [crowd, phase, seatBanner]);

  // ---- N3 ----
  const startL3 = () => splashThen(["TRIVIAL", "DEL FRENTE AMPLIO"], startL3b);
  const startL3b = () => { PREGUNTAS = pick5(); setQi(0); setFirstTry(0); setWrong(null); setQOk(null); setPhase("l3"); Music.start(2); };
  const advQ = () => { setQOk(null); setWrong(null); setQLeft(Q_TIME); if (qiRef.current === PREGUNTAS.length - 1) { Music.stop(); setPhase("end"); } else setQi((q) => q + 1); };
  const answer = (j) => { if (Date.now() - qT0.current < 1800) return; if (wrong !== j && j !== PREGUNTAS[qi].ok) setWrongMsg(pickR(FALLO));
    const Q = PREGUNTAS[qi]; if (qOk !== null) return;
    if (j === Q.ok) { Music.fx("win"); if (wrong === null) setFirstTry((f) => f + 1); setQOk(true); setTimeout(advQ, 3800); }
    else { Music.fx("wrong"); setWrong(j); }
  };

  const score = Math.round(hucha / 10) + seats.length * 1000 + firstTry * 300;
  const mil = (m) => (m >= 1000 ? (m / 1000).toLocaleString("es", { maximumFractionDigits: 1 }) + " MIL M€" : m + " M€");
  const saveScore = async () => {
    const n = (nick.trim() || "Anónima").slice(0, 18); try { localStorage.setItem("aquiestan.nick", n); } catch (e) {}
    const db = dbRef.current, uid = uidRef.current;
    if (db && uid) { const prev = board.find((b) => b.id === uid) || {}; try { await db.doc("scores/" + uid).set({ nick: n, score: Math.max(score, prev.score || 0), hucha: Math.max(hucha, prev.hucha || 0), seats: Math.max(seats.length, prev.seats || 0), at: Date.now() }); } catch (e) {} }
    setSaved(true);
  };
  const others = board.filter((b) => b.id !== uidRef.current);
  const localHist = (() => { try { return JSON.parse(localStorage.getItem("votautil.hist") || "[]"); } catch (e) { return []; } })();
  const pool = dbOk ? others : localHist;
  const rankH = 1 + pool.filter((b) => (b.hucha || 0) > hucha).length, rankS = 1 + pool.filter((b) => (b.seats || 0) > seats.length).length, totalP = pool.length + 1;
  useEffect(() => { if (phase !== "end") { endedRef.current = false; return; } if (endedRef.current) return; endedRef.current = true; setEndBg(Math.floor(Math.random() * 4)); Music.fx("fanfare"); try { const h = JSON.parse(localStorage.getItem("votautil.hist") || "[]"); h.push({ hucha, seats: seats.length }); localStorage.setItem("votautil.hist", JSON.stringify(h.slice(-200))); } catch (e) {} if (dbRef.current && uidRef.current) saveScore(); }, [phase]);
  const rb = [...board].sort((a, b) => (b[rankBy] || 0) - (a[rankBy] || 0));
  const fmtR = (p) => rankBy === "hucha" ? mil(p.hucha || 0) : (p.seats || 0) + " esc.";
  const press = () => { if (!deckRef.current.length) deckRef.current = PROG_SLOGANS.slice().sort(() => Math.random() - 0.5); setNopress(deckRef.current.pop()); setTimeout(() => Music.fx("thudsoft"), 300); };
  const share1 = `💰🔥 *EL JUEGO DEL VOTO ÚTIL* 🔥💰\n\nHe tasado a *${tasados.length} megarricos* en 30 segundos\n🐷 Hucha de la mayoría: *${mil(hucha)}*\n\n${reparto.slice(0, 4).map(([s, m]) => `${s[0]} ${s[1]}: ${mil(m)}`).join("\n")}\n\n✊ *QUE PAGUE MÁS QUIEN MÁS TIENE*\n📮 29N · *voto útil = Frente Amplio*\n🎮 ${GAME_URL}`;
  const share2 = `⚡📮 *¡ESCAÑOS ARREBATADOS!* 📮⚡\n\n${seats.length ? seats.map((s) => `✅ ${s.prov}: ${s.retain ? "retenido frente a" : "arrebatado a"} ${s.rival} (¡solo ${s.votos.toLocaleString("es")} votos!)`).join("\n") : "He empezado a convencer indecisos"}\n\n💡 El voto útil es el *Frente Amplio*\n📮 29N\n🎮 ${GAME_URL}`;
  const shareEnd = `🏠✨ *LA VIVIENDA, UN DERECHO DE VERDAD* ✨🏠\n\n💰 ${mil(hucha)} recaudados a los megarricos\n📮 ${seats.length} escaños arrebatados a la derecha\n🏆 Nº${rankH} tasando megarricos · Nº${rankS} arrebatando escaños\n\n📮 *El 29N, voto útil = Frente Amplio*\n📖 ${PROGRAMA_URL}\n🎮 ¿Te atreves? 👉 ${GAME_URL}`;


  return (
    <div style={S.app}>
      <style>{CSS}</style>
      <button style={S.mute} onClick={() => setMuted(!muted)}>{muted ? "🔇" : "🔊"}</button>

      {phase === "start" && (
        <div style={S.center} className="stripes">
          <h1 key={drop} style={S.title} className="quake2" onClick={() => setDrop((d) => d + 1)}><span className="w1" style={{ ...S.word, color: YEL }}>VOTO</span><span className="w2" style={{ ...S.word, color: "#fff", textAlign: "center" }}>ÚTIL</span></h1>
          <div className="fadeup big3d" style={{ fontFamily: FONT, fontSize: "clamp(20px, 3.4vw, 40px)", background: INK, color: YEL, padding: "8px 22px", rotate: "-2deg", marginBottom: 10, textAlign: "center", lineHeight: 1.05 }}>Un juego donde ganamos <span style={{ color: "#fff", position: "relative" }}>casi<sup style={{ color: YEL }}>*</sup></span> <span style={{ color: "#fff" }}>todas</span></div>
          <button onClick={startL1} style={{ ...S.btn, background: YEL, color: INK, fontSize: 28, padding: "14px 44px" }}>JUGAR</button>
          <button style={{ ...S.red, fontSize: 52, lineHeight: 1 }} aria-label="Más" onClick={press}>+</button>
          <div style={{ position: "absolute", bottom: 16, left: "50%", translate: "-50% 0", width: "min(90vw, 640px)", textAlign: "center", color: "#fff", fontFamily: FONT, fontSize: 15 }}>* O sea, el 99 %. No apto para especuladores.</div>
        </div>
      )}

      {/* ---------------- NIVEL 1 ---------------- */}
      {phase === "l1" && (
        <div style={{ ...S.play, background: "#fbf6ef" }}>
          <div style={S.hud}>
            <div className={left <= 5 ? "blink" : ""} style={{ ...S.box, background: left <= 5 ? MAL : INK }}>{left}</div>
            <div style={{ flex: 1 }}>
              <div style={S.hudT}>{mobile ? "HUCHA" : "HUCHA DE LA MAYORÍA"} · {mil(hucha)}</div>
              
            </div>
          </div>
          <div style={S.boardWrap}>
            <div className={left <= 10 ? "alarm" : ""} style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 18, background: "#fff", border: "4px solid " + INK }}>
              {holes.map((h, i) => h && (
                <div key={h.k} className="pop" style={{ left: 17 + (i % 3) * 33 + h.jx + "%", top: 18 + Math.floor(i / 3) * 32 + h.jy + "%", "--sz": h.sz, "--gr": h.gr }}>
                  <div className={"popIn " + (h.hit ? (h.rich ? "fried" : "oops") : "")} onPointerDown={() => tapL1(i)}><Bicho look={h.look} size={200} talk={i % 3} /></div>
                </div>
              ))}
              {joke && <div key={joke} className="joke">{joke}</div>}
              {idle && <div className="idleAd">¡SEÑALA A LOS RICOS<br /><span style={{ color: "#fff" }}>Y TÁSALOS!</span></div>}
              {left <= 10 && left > 0 && <div className="warn">¡A FREÍRLOS A IMPUESTOS!</div>}
              {left <= 10 && left > 0 && <div className="warn warn2">¡PEÑA, VAAAA!</div>}
              {flash && <div key={flash.k || flash.m + "" + flash.i} className={"tasaC" + (flash.x > 1 ? " tasaX" : "")} style={flash.bad ? { whiteSpace: "normal", width: "min(86%, 900px)", color: "#fff", background: BIEN, padding: "12px 28px", border: "5px solid " + INK, borderRadius: 14, fontSize: "clamp(34px, 7vw, 84px)" } : flash.x > 1 ? { color: MAL, background: YEL, whiteSpace: "normal", width: mobile ? "88%" : "auto", padding: mobile ? "12px 10px" : "16px 34px", border: `6px solid ${INK}`, borderRadius: 18, fontSize: mobile ? "11vw" : flash.x === 3 ? "clamp(56px, 12vw, 150px)" : "clamp(48px, 10.5vw, 130px)" } : { color: MAL }}>{flash.bad ? <>{flash.txt}<br /><span style={{ color: YEL, fontSize: "60%" }}>¡Pierdes {flash.pen} s!</span></> : <>{flash.x === 3 ? "¡TASA TRIPLE!" : flash.x === 2 ? "¡TASA DOBLE!" : "¡TOMA TASA!"}<br />{flash.x > 1 && <span style={{ display: "block", fontSize: "36%", color: INK, margin: "8px 0", textShadow: "none", WebkitTextStroke: 0 }}>{flash.praise}</span>}<span style={{ fontSize: "55%" }}>+{flash.m.toLocaleString("es")} M€</span></>}</div>}
            </div>
          </div>
        </div>
      )}

      {phase === "pick" && (
        <div style={{ ...S.res2, justifyContent: mobile ? "center" : "flex-start", paddingTop: 24, overflowY: "auto" }}>
          <div style={{ textAlign: "center", position: "relative", zIndex: 3 }}><div className="titleMove big3d" style={{ fontFamily: FONT, color: YEL, lineHeight: 0.95, fontSize: "clamp(30px, 8vw, 92px)" }}>¡ESCOGE PROVINCIA!</div><div className="bandMove" style={{ display: "inline-block", background: INK, color: "#fff", fontFamily: FONT, fontSize: "clamp(15px, 3vw, 34px)", padding: "6px 18px", marginTop: 6 }}>Y ARREBATA ESCAÑOS A <span style={{ color: YEL }}>PP/VOX</span></div></div>
          {seats.length > 0 && <div style={{ fontFamily: FONT, color: "#fff", background: INK, borderRadius: 999, padding: "6px 18px", marginTop: 8, fontSize: "clamp(14px, 1.8vw, 20px)" }}>Llevas {seats.length} {seats.length === 1 ? "escaño" : "escaños"} · te quedan <span style={{ color: YEL }}>{left} s</span> · ¿a qué provincia vas ahora?</div>}
          <div style={{ position: "relative", width: "min(96vw, calc((100vh - 210px) * 1.53), 1150px)", aspectRatio: "135 / 88", marginTop: 10 }}>
            <svg viewBox="0 0 135 88" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <polygon points={SPAIN} fill="#f3d9cf" stroke={INK} strokeWidth="0.5" strokeLinejoin="round" />
              {ISLAS.map((p, k) => <polygon key={k} points={p} fill="#f3d9cf" stroke={INK} strokeWidth="0.4" />)}
              <rect x="1" y="56" width="36" height="30" rx="2" fill="none" stroke="#fff" strokeWidth="0.4" strokeDasharray="1.5 1" />
              {CANARIAS.map((p, k) => <polygon key={k} points={p} fill="#f3d9cf" stroke={INK} strokeWidth="0.4" />)}
            </svg>
            {provOrder.map((pi, k) => { const e = ESCANOS[pi], [x, y] = provXY(e), won = seats.some((q) => q.prov === e[0] && q.rival === e[1]), sel = pickInfo === pi; return <div key={pi} className="pdot" onClick={() => { if (won || pickInfo !== null) return; setPickInfo(pi); Music.fx("tick"); setTimeout(() => { setPickInfo(null); goL2(pi); }, 1500); }} style={{ left: (x / 135) * 100 + "%", top: (y / 88) * 100 + "%", zIndex: sel ? 9 : 2, cursor: won ? "default" : "pointer" }}>
              <i style={{ background: won ? YEL : "#8b5cf6", animationDelay: `${(k % 7) * 0.2}s` }} />
              <span>{e[0] === "Madrid" ? `Madrid (${e[1]})` : mobile && e[0] === "Santa Cruz de Tenerife" ? "Tenerife" : e[0]}{won ? " ✓" : ""}</span>
              {sel && <div className="pinfo">A {e[2].toLocaleString("es")} votos<br />de quitarle el escaño a {e[1]}</div>}
            </div>; })}
            {!walkTo && (mobile ? [[16, 122], [50, 132], [84, 122]] : [[-7, 22], [107, 18], [107, 62], [-7, 52]]).map(([fx, fy], n) => { const hint = idleHint && idleHint.n === n && Date.now() - idleHint.t < 3500; return <div key={n} className="idleFace" onClick={() => setIdleHint({ n, t: Date.now() })} style={{ left: fx + "%", top: fy + "%", animationDelay: `${n * 0.7}s` }}>
              <div className="faceC"><Bicho look={{ ...lookByName("idle" + n, LOOKS.pueblo), mood: n % 2 ? "frown" : "plain" }} size={90} talk={n} /></div>
              <div className="bubbleTxt idleBub" key={hint ? "h" + idleHint.t : idleMood + n} style={hint ? { background: YEL } : null}>{hint ? "¡Tienes que convencerme! Elige provincia" : IDLE_FR[(idleMood + n * 2) % IDLE_FR.length]}</div>
            </div>; })}
            {walkTo && <div className="walkerMap" style={{ "--tx": (walkTo[0] / 135) * 100 + "%", "--ty": (walkTo[1] / 88) * 100 + "%" }}>
              <Bicho look={{ ...lookByName("sofa", LOOKS.pueblo), mood: "brave" }} size={80} />
              <div className="bubbleTxt" style={{ fontSize: 18, padding: "6px 12px", background: YEL }}>¡ALLÁ VAMOS! ¡NO PASARÁN!</div>
            </div>}
          </div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, opacity: 0.9, marginTop: 6, display: mobile ? "none" : "block" }}>Votos que faltan para arrebatar el último escaño. Fuente: estimación de la campaña del Frente Amplio.</div>
        </div>
      )}

      {phase === "r1" && (
        <div style={S.res2}>
          <div className="big3d" style={S.resBig}>{mil(hucha)}</div>
          {hucha > 0 && <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(26px, 4.4vw, 52px)", color: YEL, lineHeight: 1, marginTop: -6 }}>¡que van para todas!</div>}
          {hucha === 0 ? <><div style={{ fontFamily: FONT, fontSize: "clamp(22px, 3.6vw, 38px)", color: "#fff", textAlign: "center", lineHeight: 1.1 }}>Sin tasar a nadie no se puede hacer nada.<br />¡Vuelve a por ellos!</div><button className="go" onClick={startL1}><span>Repetir</span></button></> : <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", width: "min(92vw, 820px)", margin: "8px 0 14px" }}>{medR1.map((m, i) => <div key={m} className="hdrop" style={{ fontFamily: FONT, fontSize: "clamp(17px, 2.3vw, 28px)", lineHeight: 1.15, color: INK, background: "#fff", border: `4px solid ${INK}`, borderLeft: `14px solid ${YEL}`, borderRadius: 14, padding: "12px 20px", boxShadow: `5px 6px 0 ${INK}`, width: "100%", boxSizing: "border-box", textAlign: "left", rotate: `${(i - 1) * 0.8}deg`, animationDelay: `${0.5 + i * 0.7}s` }}>{m}</div>)}</div>
          <button className="go" onClick={startL2}><i className="fill" /><span>Siguiente ▶ {cd}</span></button>
          <div className="mini"><button onClick={startL1}>Repetir</button><a href={wa(share1)} target="_blank" rel="noreferrer">Compartir</a></div></>}
        </div>
      )}

      {/* ---------------- NIVEL 2 ---------------- */}
      {phase === "l2" && (
        <div style={{ ...S.play, background: "#fbf6ef" }}>
          <div style={S.hud}>
            <div className={left <= 5 ? "blink" : ""} style={{ ...S.box, background: left <= 5 ? MAL : INK }}>{left}</div>
            <div style={{ flex: 1 }}>
              <div style={S.faltan} key={Math.max(0, target[2] - votos)} className="slam">¡Estás a {Math.max(0, target[2] - votos).toLocaleString("es")} votos! <span style={{ color: MAL }}>{ANIMOS[Math.floor(left / 3) % ANIMOS.length]}</span></div>
              <div style={{ ...S.hudT, fontSize: 16 }}>{target[0].toUpperCase()} · {target[3] ? "RETENER FRENTE A" : "ARREBATAR A"} {target[1].toUpperCase()}</div>
              <div style={S.meterBg}><div style={{ ...S.meterFg, width: `${Math.min(100, (votos / target[2]) * 100)}%` }} /></div>
              <div style={{ fontSize: 12, fontWeight: 800, color: INK }}>{votos.toLocaleString("es")} / {target[2].toLocaleString("es")} votos · escaños: {seats.length}</div>
            </div>
          </div>
          <div style={S.field}>
                        {crowd.map((c, idx) => (
              <div key={c.k} onPointerDown={() => tapL2(idx)} className={"walker big solo " + c.state} data-k={c.hitK} style={{ left: c.x + "%", top: c.y + "%", animationDelay: `${(c.i % 7) / 3}s` }}>
                {c.tag && <div className="ptag" style={{ background: c.ring }}>{c.tag}</div>}
                <div style={{ width: "100%", borderRadius: "50%", boxShadow: c.ring ? `0 0 0 8px ${c.ring}` : "none" }}><Bicho look={c.look} size={120} talk={c.i % 3} /></div>
                {(c.state === "duda" || c.state === "facha") && <div className="bubbleTxt" key={c.duda}>{c.duda}</div>}
                {c.state === "facha" && !c.tag && <div className="fachaVest"><i /></div>}
                {c.state === "power" && c.mult > 1 && <div className="mult">+{c.mult - 1}</div>}
                {c.state === "power" && <div className="bubbleTxt power">{c.msg}</div>}
              </div>
            ))}
            {phase === "l2" && crowd[0] && crowd[0].state === "facha" && <div className="argPanel" key="f" style={{ background: INK, color: "#fff" }}>
              <div style={{ fontFamily: FONT, fontSize: 14, letterSpacing: 2, color: YEL }}>OJO</div>
              <div style={{ fontFamily: FONT, fontSize: "clamp(22px, 3vw, 38px)", lineHeight: 1.15, margin: "8px 0 16px" }}>{crowd[0].note || "No nos votaría nunca. Si le das la papeleta, pierdes 3 s."}</div>
              <button className="armedSlow" onPointerDown={(e) => { e.stopPropagation(); Music.fx("tick"); setCrowd(newCrowd()); }} style={{ ...S.btn, background: YEL, color: INK, fontSize: 22, padding: "10px 26px" }}>SIGUIENTE ▶</button>
            </div>}
            {phase === "l2" && crowd[0] && crowd[0].state === "duda" && <div className="argPanel" key={crowd[0].duda}>
              <button className="voteCard armed" onPointerDown={(e) => { e.stopPropagation(); tapL2(0); }}>
                <div className="vcHead">¡VOTO ÚTIL!</div>
                <div className="vcText">{crowd[0].arg || answerFor(crowd[0].duda, target)}</div>
                <div className="vcTap">TOCA</div>
              </button>
            </div>}
            {rays.slice(-6).map((r) => crowd[r.idx] && <div key={r.k} className="ballot" style={{ left: crowd[r.idx].x + "%", top: crowd[r.idx].y + "%" }}><span>VOTO<br />ÚTIL</span></div>)}
            {plus && <div key={plus} className="tasaC" style={{ color: BIEN, top: "16%", fontSize: "clamp(36px,6vw,70px)" }}>{seatBanner ? "+10 s" : "¡+" + 2 * ((crowd[0] && crowd[0].mult) || 1) + " s!"}</div>}
            {seatBanner && <div style={S.seatWrap}><div style={S.seatBan} className="slam"><div className="big3d" style={S.seatBig}>¡ESCAÑO {seatBanner.retain ? "RETENIDO" : "ARREBATADO"}!</div><div style={S.sub2}>{seatBanner.prov.toUpperCase()} · {seatBanner.retain ? "FRENTE A" : "A"} {seatBanner.rival.toUpperCase()}</div><div style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>¡Solo dependía de {seatBanner.votos.toLocaleString("es")} votos!</div>
              <div style={{ fontFamily: FONT, fontSize: "clamp(16px, 2vw, 22px)", marginTop: 14 }}>{seats.length} {seats.length === 1 ? "escaño" : "escaños"} · ¿y ahora qué?</div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
                {seats.length < ESCANOS.length && <button onClick={nextProv} style={{ ...S.btn, background: YEL, color: INK, fontSize: "clamp(16px, 2vw, 22px)", padding: "12px 22px" }}>¡A por otra provincia! ▶</button>}
                <button onClick={goHome} style={{ ...S.btn, background: "#fff", color: INK, fontSize: "clamp(14px, 1.7vw, 18px)", padding: "12px 18px" }}>Me voy a casa, ya he convencido mucho por hoy</button>
              </div></div></div>}
          </div>
          
        </div>
      )}

      {phase === "r2" && (
        <div style={S.res2}>
          <div className="big3d" style={S.resBig}>{seats.length} {seats.length === 1 ? "escaño" : "escaños"}</div>
          {seats.length > 0 && <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(20px, 3.4vw, 42px)", color: "#fff", textAlign: "center", lineHeight: 1.1, maxWidth: 900 }}>{seats.length === 1 ? "arrebatado" : "arrebatados"} para hacer posible<br /><span style={{ color: YEL }}>¡un gobierno progresista!</span></div>}
          {seats.length <= 1 && <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(22px, 3.6vw, 40px)", color: "#fff", textAlign: "center", lineHeight: 1.1, maxWidth: 820 }}>Esto no puede pasar el 29N,<br />¡así que inténtalo otra vez!</div>}
          {seats.length > 0 ? <><button className="go" onClick={startL3}><i className="fill" /><span>Siguiente ▶ {cd}</span></button>
          <div className="mini"><button onClick={startL2}>Repetir</button><a href={wa(share2)} target="_blank" rel="noreferrer">Compartir</a></div></> : <button className="go" onClick={startL2}><span>Repetir</span></button>}
        </div>
      )}

      {/* ---------------- NIVEL 3 ---------------- */}
      {phase === "l3" && (() => { const Q = PREGUNTAS[qi]; return (
        <div style={{ ...S.play, background: "#fbf6ef", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={S.qCard} className="slam" key={qi}>
            <div className={qLeft <= 5 && qOk === null ? "blink" : ""} style={{ ...S.box, alignSelf: "center", marginBottom: 8, background: qLeft <= 5 ? MAL : INK }}>{Math.max(0, qLeft)}</div>
            
            <div style={S.qText}>{Q.q}</div>
            <div style={{ display: "grid", gap: 10 }}>{Q.a.map((t, j) => <button key={j} onClick={() => answer(j)} className={wrong === j ? "shake" : ""} style={{ ...S.ans, background: qOk && j === Q.ok ? BIEN : wrong === j ? "#ffd6de" : "#fff", color: qOk && j === Q.ok ? "#fff" : INK, textDecoration: wrong === j ? "line-through" : "none" }}>{t}</button>)}</div>
            {wrong === -1 && qOk && <div style={{ ...S.fb, background: "#ffe1e6", color: MAL }}>{wrongMsg}</div>}
            {wrong !== null && !qOk && <div style={{ ...S.fb, background: "#ffe1e6", color: MAL }}>{wrongMsg}</div>}
            {qOk && <div style={{ ...S.fb, background: BIEN, color: "#fff" }}>¡Eso es! <b>Frente Amplio:</b> {Q.fa}</div>}
          </div>
        </div>); })()}

      {phase === "end" && (
        <div style={{ ...S.res2, overflowX: "hidden", overflowY: "auto", justifyContent: mobile ? "flex-start" : "center", paddingTop: mobile ? 40 : undefined }} className="epic">
          <div className="rays" />
          <div className="rocket"><svg viewBox="0 0 60 140" width="100%"><path d="M30 0 C46 18 48 50 46 90 L14 90 C12 50 14 18 30 0 Z" fill="#fff" stroke="#141414" strokeWidth="3" /><circle cx="30" cy="42" r="9" fill="#c6f432" stroke="#141414" strokeWidth="3" /><path d="M14 70 L0 100 L14 92 Z M46 70 L60 100 L46 92 Z" fill="#e8452c" stroke="#141414" strokeWidth="3" /><text x="30" y="80" textAnchor="middle" fontFamily="Archivo Black" fontSize="11" fill="#141414">29N</text><path className="flame" d="M18 92 Q30 140 42 92 Z" fill="#ffd25a" /></svg></div>
          {endBg === 0 && <div className="bgCrowd">{Array.from({ length: 14 }, (_, i) => <div key={i} className="jumper" style={{ left: 2 + i * 7 + "%", animationDelay: `${(i % 5) * 0.15}s` }}><Bicho look={lookByName("fiesta" + i, EMPOWER_LOOK)} size={100} talk={i % 3} /></div>)}</div>}
          {endBg === 1 && <div className="bgFire">{Array.from({ length: 7 }, (_, i) => <div key={i} className="burst" style={{ left: 8 + i * 13 + "%", top: 10 + (i % 3) * 18 + "%", animationDelay: `${i * 0.45}s`, color: [YEL, "#fff", "#ffd25a"][i % 3] }}>{Array.from({ length: 12 }, (_, j) => <i key={j} style={{ rotate: j * 30 + "deg" }} />)}</div>)}</div>}
          {endBg === 2 && <div className="bgFlags">{Array.from({ length: 9 }, (_, i) => <div key={i} className="flag" style={{ left: 3 + i * 11 + "%", animationDelay: `${i * 0.2}s`, background: [YEL, "#fff", INK][i % 3] }}><span>{["29N", "SÍ", "VOTA", "ÚTIL", "¡YA!", "29N", "SÍ", "VOTA", "¡YA!"][i]}</span></div>)}</div>}
          {endBg === 3 && <div className="bgCity">{Array.from({ length: 10 }, (_, i) => <div key={i} className="bldg" style={{ left: i * 10 + "%", height: 25 + ((i * 37) % 40) + "%" }}>{Array.from({ length: 12 }, (_, j) => <i key={j} style={{ animationDelay: `${(i * 7 + j * 3) % 20 * 0.2}s` }} />)}</div>)}</div>}
          {Array.from({ length: 60 }, (_, i) => <i key={i} className="confeti" style={{ left: (i * 37) % 100 + "%", background: [YEL, "#fff", INK][i % 3], animationDelay: `${(i % 12) * 0.25}s`, animationDuration: `${2.6 + (i % 5) * 0.5}s` }} />)}
          <div className="hdrop big3d" style={{ position: "relative", fontFamily: FONT, fontSize: "clamp(36px, min(7vw, 9vh), 100px)", color: YEL, lineHeight: 0.92, textAlign: "center" }}>¡MISIÓN 29N<br /><span style={{ color: "#fff" }}>CUMPLIDA!</span></div>
          <div className="statsRow">{[[tasados.length, "megarricos tasados"], [mil(hucha), "para la mayoría"], [seats.length, "escaños a la derecha"], [NUMF(seats.reduce((a, q) => a + q.votos, 0)), "votos movilizados"], [firstTry + "/5", "aciertos"]].map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
          <div style={{ position: "relative", display: "flex", gap: "clamp(14px, 3vw, 40px)", flexWrap: "wrap", justifyContent: "center", margin: "14px 0" }}>
            {[[rankH, "en tasar megarricos", mil(hucha)], [rankS, "en arrebatar escaños", seats.length + (seats.length === 1 ? " escaño" : " escaños")]].map(([r, l, v], k) => <div key={l} className="medal hdrop" style={{ animationDelay: `${1.6 + k * 0.6}s, ${2.4 + k * 0.6}s` }}>
              <div style={{ fontFamily: FONT, fontSize: "clamp(15px, 1.6vw, 20px)", color: INK }}>ERES LA</div>
              <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(48px, min(8vw, 11vh), 110px)", lineHeight: 0.9, color: MAL }}>Nº{r}</div>
              <div style={{ fontFamily: FONT, fontSize: "clamp(16px, 1.8vw, 22px)", color: INK }}>{l}</div>
              <div style={{ fontFamily: FONT, fontSize: "clamp(22px, 2.8vw, 34px)", color: BIEN, marginTop: 4 }}>{v}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#555" }}>de {totalP.toLocaleString("es")} {totalP === 1 ? "partida" : dbOk ? "jugadoras" : "partidas"}</div>
            </div>)}
          </div>
          <div className="hdrop" style={{ position: "relative", animationDelay: "3.2s", fontFamily: FONT, fontSize: "clamp(16px, min(2.4vw, 3.2vh), 30px)", color: "#fff", textAlign: "center", lineHeight: 1.15, maxWidth: 900 }}>Pasó en EE. UU., en Brasil y ahora en España,<br /><span style={{ color: YEL }}>gracias a tu compromiso con la democracia.</span><br /><span className="big3d" style={{ display: "inline-block", marginTop: 10, fontSize: "1.5em", color: "#fff" }}>¡LO HAREMOS POSIBLE!</span></div>
          <div style={{ position: "relative", marginTop: 18, textAlign: "center" }}><button className="go" onClick={startL1}><span>Jugar otra vez</span></button><div className="mini"><a href={wa(shareEnd)} target="_blank" rel="noreferrer">Compartir</a><button onClick={() => setShowRank(true)}>Ranking</button></div></div>
        </div>
      )}

      {reward && (
        <div onClick={() => setReward(null)} style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(20,20,20,.88)", display: "grid", placeItems: "center", padding: 16 }}>
          {reward.type === "card" ? <div className="rewardCard">
            <div style={{ font: `900 13px ${FONT}`, letterSpacing: 3, color: MAL }}>CARTA ÚNICA · {reward.list.length} ESCAÑOS</div>
            <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(30px, 7vw, 52px)", color: YEL, lineHeight: 1, margin: "8px 0" }}>¡TRIPLETE!</div>
            {reward.list.slice(-6).map((q) => <div key={q.prov + q.rival} style={{ font: `900 clamp(12px, 2vw, 18px) ${FONT}`, color: INK, background: "#fff", border: `2px solid ${INK}`, borderRadius: 8, padding: "4px 10px", margin: "4px 0" }}>{q.prov} · arrebatado a {q.rival} · {NUMF(q.votos)} votos</div>)}
            <div style={{ font: `900 clamp(15px, 2vw, 20px) ${FONT}`, color: INK, marginTop: 8 }}>{NUMF(reward.list.reduce((a, q) => a + q.votos, 0))} votos movilizados</div>
          </div> : <div style={{ textAlign: "center" }}>
            <svg viewBox="0 0 300 200" className="ship" style={{ width: "min(90vw, 560px)" }}>
              <rect x="0" y="130" width="300" height="70" fill="#1b3a6b" /><g className="shipBody"><path d="M60 110 L240 110 L220 140 L80 140 Z" fill="#141414" /><rect x="90" y="88" width="120" height="22" fill="#e9e1d3" stroke="#141414" strokeWidth="2" />{[110, 140, 170].map((x) => <rect key={x} x={x} y="62" width="14" height="26" fill="#e8452c" stroke="#141414" strokeWidth="2" />)}<text x="150" y="132" textAnchor="middle" fill="#fff" fontFamily="Archivo Black" fontSize="16">PP + VOX</text></g>
              <path className="wave" d="M0 135 Q25 125 50 135 T100 135 T150 135 T200 135 T250 135 T300 135 V200 H0 Z" fill="#2a5aa0" />
            </svg>
            <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(30px, 7vw, 64px)", color: YEL, lineHeight: 1 }}>¡TODAS LAS PROVINCIAS!</div>
            <div style={{ fontFamily: FONT, fontSize: "clamp(18px, 3vw, 30px)", color: "#fff" }}>La derecha se hunde: {reward.list.length} escaños arrebatados</div>
          </div>}
        </div>
      )}

      {splash && <div style={{ position: "fixed", inset: 0, zIndex: 60, background: MAL, display: "grid", placeItems: "center" }}><div className="hdrop big3d" style={{ fontFamily: FONT, fontSize: splash[0].length > 14 ? "min(6.5vw, 10vh)" : "min(11vw, 19vh)", lineHeight: 1, color: YEL, textAlign: "center", rotate: "-4deg", padding: "0 4vw" }}>{splash[0]}<br /><span style={{ color: "#fff" }}>{splash[1]}</span></div></div>}

      {showRank && (
        <div style={{ ...S.overlay, background: "rgba(20,20,20,.94)", flexDirection: "column", gap: 16 }} onClick={() => setShowRank(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "min(760px, 94vw)" }}>
            <div className="big3d" style={{ fontFamily: FONT, fontSize: "clamp(34px, 6vw, 70px)", color: YEL }}>RANKING</div>
            <div style={{ display: "flex", gap: 8 }}>{[["hucha", "Tasar megarricos"], ["seats", "Arrebatar escaños"]].map(([k, l]) => <button key={k} onClick={() => setRankBy(k)} style={{ ...S.btn, fontSize: 15, padding: "6px 14px", background: rankBy === k ? YEL : "#fff", color: INK }}>{l}</button>)}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 240 }}>
              {[1, 0, 2].map((ix) => { const p = rb[ix]; const h = [200, 150, 110][ix]; return <div key={ix} className="hdrop" style={{ animationDelay: `${0.2 + ix * 0.25}s`, width: "min(200px, 28vw)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}><div style={{ fontFamily: FONT, color: "#fff", fontSize: "clamp(14px, 2vw, 20px)", textAlign: "center", marginBottom: 6, overflowWrap: "anywhere" }}>{p ? p.nick : "—"}<br /><span style={{ color: YEL }}>{p ? fmtR(p) : ""}</span></div><div style={{ width: "100%", height: h, background: ix === 0 ? YEL : "#fff", border: `4px solid ${INK}`, borderRadius: "12px 12px 0 0", display: "grid", placeItems: "center", fontFamily: FONT, fontSize: 56, color: INK }}>{ix + 1}</div></div>; })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>{rb.slice(3, 10).map((p, i) => <span key={p.id} style={{ background: p.id === uidRef.current ? YEL : "#fff", color: INK, borderRadius: 999, padding: "4px 12px", fontWeight: 800 }}>{i + 4}. {p.nick} · {fmtR(p)}</span>)}</div>
            <div style={{ color: "#fff", fontFamily: FONT, fontSize: 18 }}>Tu puesto: <span style={{ color: YEL }}>Nº{rankBy === "hucha" ? rankH : rankS}</span></div>
            {!saved ? <div style={{ display: "flex", gap: 8 }}><input value={nick} maxLength={18} onChange={(e) => setNick(e.target.value.replace(/[^\p{L}\p{N} _.-]/gu, ""))} placeholder="Tu nombre" style={S.nickIn} /><button style={{ ...S.btn, background: YEL, color: INK, fontSize: 16, padding: "6px 16px" }} onClick={saveScore}>Guardar</button></div> : <div style={{ color: "#fff", fontSize: 14 }}>{dbOk ? "¡Guardado!" : "Guardado en este dispositivo."}</div>}
            <button onClick={() => setShowRank(false)} style={{ ...S.btn, background: INK, color: "#fff", fontSize: 16, padding: "6px 18px" }}>Cerrar</button>
          </div>
        </div>
      )}

      {intro && (
        <div style={S.introWrap}>
          <div style={S.introCard} className="slam">
            <div style={S.introNum}>NIVEL {intro}</div>
            {intro === 2 && target ? <><div style={S.introT}>Estás a tan solo {target[2].toLocaleString("es")} votos de {target[3] ? "retener el escaño frente a" : "robarle el escaño a"} {target[1]}</div><div style={{ ...S.introT, color: MAL }}>¡A por ellos!</div><div style={S.introD}>Toca a cada persona para darle argumentos hasta que cambie de cara y se convenza. Cada persona convencida suma votos y segundos.</div></> : <><div style={S.introT}>{LVL[intro - 1][0]}</div>
            <div style={S.introD}>{LVL[intro - 1][1]}</div></>}
          </div>
        </div>
      )}

      {nopress && (
        <div style={S.overlay} onClick={() => setNopress(null)}>
          <div key={nopress[2]} style={S.npCard} className="npdrop" onClick={(e) => e.stopPropagation()}>
                        <div style={{ fontFamily: FONT, fontSize: 14, letterSpacing: 1, color: MAL }}>{nopress[1].toUpperCase()}</div>
            <div style={{ fontFamily: FONT, fontSize: "clamp(20px, 2.8vw, 30px)", lineHeight: 1.1, marginTop: 8 }}>{nopress[2]}</div>
            <div style={S.row}><Btn href={wa(`*${nopress[1]}*\n${nopress[2]}\n\nVota útil: ${GAME_URL}`)} bg="#25d366">Compartir</Btn><Btn onClick={press} bg={INK}>MÁS</Btn></div><button onClick={() => setNopress(null)} aria-label="Cerrar" style={{ position: "absolute", top: 8, right: 10, background: "none", border: 0, fontSize: 18, lineHeight: 1, cursor: "pointer", color: INK }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick, bg = YEL, href }) { const st = { ...S.btn, background: bg, color: bg === YEL ? INK : "#fff" }; return href ? <a href={href} target="_blank" rel="noreferrer" style={st}>{children}</a> : <button style={st} onClick={onClick}>{children}</button>; }
const FONT = "'Archivo Black', 'Arial Black', sans-serif";
const S = {
  app: { position: "relative", height: "100vh", overflow: "hidden", background: INK, color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" },
  mute: { position: "absolute", top: 10, right: 10, zIndex: 200, background: "#fff", border: "3px solid #111", borderRadius: 12, fontSize: 18, padding: "4px 8px", cursor: "pointer" },
  center: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 20, position: "relative", boxSizing: "border-box" },
  kick: { fontFamily: FONT, fontSize: 18, letterSpacing: 2, color: YEL, padding: "4px 0", position: "relative", zIndex: 2 },
  title: { fontFamily: FONT, fontSize: "min(25vw, 29vh)", lineHeight: 0.92, textAlign: "center", margin: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2vh", color: YEL },
  introWrap: { position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(0,0,0,.65)", zIndex: 250, padding: 16 },
  introCard: { background: "#fff", color: INK, borderRadius: 22, padding: "20px 30px", textAlign: "center", border: `6px solid ${YEL}`, transform: "none", maxWidth: 620 },
  introNum: { fontFamily: FONT, fontSize: 28, background: MAL, color: "#fff", display: "inline-block", padding: "2px 14px", borderRadius: 10, letterSpacing: 2 },
  introT: { fontFamily: FONT, fontSize: "clamp(36px, 7vw, 70px)", lineHeight: 1, margin: "10px 0 6px" },
  introD: { fontSize: 18, fontWeight: 800 },
  slogan: { fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(16px, 2.4vw, 24px)", lineHeight: 1.3, color: "#fff", maxWidth: 560 },
  provRow: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 },
  prov: { fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 999, border: "2px solid" },
  res2: { height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "40px 16px 120px", textAlign: "center", boxSizing: "border-box", position: "relative", background: MAL },
  resKick: { fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#fff", opacity: 0.85 },
  resBig: { fontFamily: FONT, fontSize: "clamp(64px, 16vw, 200px)", lineHeight: 0.95, color: YEL },
  resSub: { fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(16px, 2.2vw, 22px)", color: "#fff", maxWidth: 620 },
  destTitle: { fontFamily: FONT, fontSize: 18, color: "#fff", marginTop: 10, letterSpacing: 1, textTransform: "uppercase" },
  destList: { display: "grid", gap: 6, width: "min(560px, 100%)" },
  destRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, background: "#fff", color: INK, borderRadius: 12, padding: "10px 14px", textAlign: "left", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15 },
  toggle: { background: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: 999, padding: "8px 18px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer" },
  faltan: { fontFamily: FONT, fontSize: "clamp(18px, 2.6vw, 30px)", overflowWrap: "anywhere", maxWidth: "100%", lineHeight: 1, color: INK, marginBottom: 4 },
  word: { pointerEvents: "none", display: "block", padding: "0 0.12em", letterSpacing: "0.03em", lineHeight: 1.02 },
  levels: { display: "grid", gap: 10, marginTop: 6 },
  lvl: { display: "flex", alignItems: "center", gap: 14, background: "#fff", color: INK, padding: "8px 18px 8px 8px", borderRadius: 14, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(17px, 2.4vw, 22px)", textAlign: "left", minWidth: "min(420px, 86vw)", boxSizing: "border-box" },
  lvlNum: { fontFamily: FONT, fontSize: 26, background: MAL, color: "#fff", width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0 },
  btn: { fontFamily: FONT, fontSize: 20, letterSpacing: 1, color: "#fff", border: "none", borderRadius: 999, padding: "8px 22px", cursor: "pointer", textDecoration: "none", display: "inline-block" },
  red: { position: "absolute", right: "5%", bottom: "6%", width: 88, height: 88, borderRadius: "50%", background: "#fff", color: MAL, border: "none", fontFamily: FONT, fontSize: 16, lineHeight: 1, cursor: "pointer" },
  play: { height: "100%", display: "flex", flexDirection: "column", position: "relative", color: INK },
  hud: { display: "flex", alignItems: "center", gap: 12, padding: "10px 60px 6px 12px" },
  box: { fontFamily: FONT, fontSize: 36, color: "#fff", border: "3px solid #111", borderRadius: 12, padding: "0 14px", minWidth: 60, textAlign: "center" },
  hudT: { fontFamily: FONT, fontSize: 24, lineHeight: 1.05, color: INK },
  svcRow: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 },
  svc: { fontFamily: FONT, fontSize: 13, padding: "2px 8px", borderRadius: 8, border: `2px solid ${INK}`, letterSpacing: 1 },
  boardWrap: { flex: 1, minHeight: 0, position: "relative", margin: "4px 12px 14px" },
  building: { width: "min(92vw, 74vh)", aspectRatio: "1/1", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4%", padding: "4%", background: "#f6efe2", border: `6px solid ${INK}`, borderRadius: "24px 24px 10px 10px", boxSizing: "border-box" },
  window: { position: "relative", cursor: "pointer", touchAction: "manipulation" },
  windowIn: { position: "absolute", inset: 0, background: "#a9d8f5", border: `5px solid ${INK}`, borderRadius: "50% 50% 8px 8px / 30% 30% 8px 8px", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" },
  sill: { position: "absolute", left: "-6%", right: "-6%", bottom: "-6%", height: "12%", background: "#c9a27e", border: `4px solid ${INK}`, borderRadius: 6 },
  result: { height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "26px 16px 120px", textAlign: "center", boxSizing: "border-box", position: "relative" },
  big: { fontFamily: FONT, fontSize: "clamp(48px, 10vw, 120px)", lineHeight: 0.95, color: YEL, },
  sub: { fontFamily: FONT, fontSize: 16, color: "#fff", letterSpacing: 1 },
  sub2: { fontFamily: FONT, fontSize: 24, letterSpacing: 1 },
  reparto: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 8, width: "min(860px, 100%)" },
  repItem: { display: "flex", gap: 8, alignItems: "center", background: BIEN, borderRadius: 12, padding: "6px 10px", textAlign: "left", border: "3px solid #fff" },
  listTitle: { fontFamily: FONT, fontSize: 24, color: YEL, marginTop: 6 },
  tasList: { display: "grid", gap: 4, width: "min(560px, 100%)", maxHeight: 260, overflowY: "auto" },
  tasItem: { display: "flex", alignItems: "center", gap: 10, background: "#fff", color: INK, borderRadius: 10, padding: "4px 10px", fontWeight: 800, justifyContent: "space-between" },
  row: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 8 },
  meterBg: { height: 18, background: "#fff", border: `3px solid ${INK}`, borderRadius: 10, overflow: "hidden", margin: "4px 0 2px" },
  meterFg: { height: "100%", background: `repeating-linear-gradient(-45deg, ${BIEN} 0 14px, #4da3ff 14px 28px)`, transition: "width .3s" },
  field: { position: "relative", flex: 1, margin: "0 12px", border: `5px solid ${INK}`, borderRadius: 22, background: "radial-gradient(rgba(0,0,0,.06) 1.5px, transparent 1.5px) 0 0/20px 20px, #f3efff", overflow: "hidden" },
  hint: { fontFamily: FONT, fontSize: 16, textAlign: "center", padding: "6px 0 10px", color: INK, letterSpacing: 1 },
  seatWrap: { position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(0,0,0,.45)", zIndex: 40 },
  seatBan: { background: BIEN, color: "#fff", border: "6px solid #fff", borderRadius: 22, padding: "16px 30px", textAlign: "center", transform: "none" },
  seatBig: { fontFamily: FONT, fontSize: "clamp(36px, 7vw, 76px)", lineHeight: 1, color: YEL },
  house: { display: "grid", gridTemplateColumns: "repeat(5, 46px)", gap: 4, marginBottom: 10, padding: "40px 10px 6px", background: `linear-gradient(135deg, transparent 50%, ${INK} 50%) left top/50% 40px no-repeat, linear-gradient(225deg, transparent 50%, ${INK} 50%) right top/50% 40px no-repeat` },
  brick: { height: 34, border: `3px solid ${INK}`, borderRadius: 6, display: "grid", placeItems: "center", fontSize: 18 },
  qCard: { background: "#fff", border: `5px solid ${INK}`, borderRadius: 22, padding: "clamp(18px, 3vw, 40px)", width: "min(1200px, 96vw)", minHeight: "86vh", display: "flex", flexDirection: "column", justifyContent: "center" },
  qNum: { fontFamily: FONT, fontSize: "clamp(16px, 2vw, 24px)", color: MAL, letterSpacing: 2 },
  qText: { fontFamily: FONT, fontSize: "clamp(30px, 5.5vw, 68px)", lineHeight: 1.05, margin: "10px 0 24px" },
  ans: { fontSize: "clamp(18px, 2.6vw, 32px)", fontWeight: 800, padding: "clamp(12px, 2vw, 24px) 20px", border: `3px solid ${INK}`, borderRadius: 14, cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" },
  fb: { marginTop: 16, borderRadius: 12, padding: "12px 16px", fontWeight: 700, fontSize: "clamp(15px, 1.8vw, 22px)", lineHeight: 1.35 },
  finalBox: { background: "#fff", color: INK, border: "5px solid " + YEL, borderRadius: 20, padding: "14px 22px", fontSize: 18, lineHeight: 1.5 },
  rankBox: { background: "rgba(255,255,255,.08)", border: "3px solid #fff", borderRadius: 18, padding: "10px 16px", width: "min(420px, 92%)" },
  rankRow: { display: "flex", justifyContent: "space-between", padding: "4px 8px", borderRadius: 8, fontWeight: 800 },
  nickIn: { fontFamily: FONT, fontSize: 20, padding: "6px 12px", borderRadius: 10, border: "3px solid #fff", width: 180 },
  overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", display: "grid", placeItems: "center", zIndex: 300, padding: 16 },
  npCard: { position: "relative", background: YEL, color: INK, border: "none", borderRadius: 22, padding: 24, maxWidth: 460, textAlign: "center", transform: "none" },
};
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@500;800&display=swap');
.stripes{background:#e8452c}
.glitch{}
@keyframes glitch{0%,90%,100%{translate:0 0}92%{translate:-4px 2px}94%{translate:4px -2px}96%{translate:-2px 0}}
.wobble{animation:wob 1.6s ease-in-out infinite}
@keyframes wob{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.stone{position:relative;letter-spacing:.01em;color:transparent;
 background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.35) 0 2px,transparent 3px) 0 0/23px 19px,radial-gradient(circle at 70% 60%,rgba(0,0,0,.25) 0 2px,transparent 3px) 0 0/17px 21px,radial-gradient(circle at 40% 80%,rgba(0,0,0,.18) 0 3px,transparent 4px) 0 0/31px 27px,linear-gradient(170deg,#e9e6df 0%,#b9b4aa 45%,#8d877c 70%,#6f695f 100%);
 -webkit-background-clip:text;background-clip:text;-webkit-text-stroke:0.012em #3b3730;filter:drop-shadow(0.012em 0.012em 0 #5e584f) drop-shadow(0.012em 0.012em 0 #514c44) drop-shadow(0.012em 0.012em 0 #47423b) drop-shadow(0.012em 0.012em 0 #3c3832) drop-shadow(0.012em 0.012em 0 #322e29) drop-shadow(0.03em 0.05em 0.03em rgba(0,0,0,.55))}
.stone.lime{background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.45) 0 2px,transparent 3px) 0 0/23px 19px,radial-gradient(circle at 70% 60%,rgba(0,0,0,.2) 0 2px,transparent 3px) 0 0/17px 21px,linear-gradient(170deg,#eaffb0 0%,#c6f432 45%,#93ba1c 75%,#6d8a12 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-stroke:0.012em #3d4a0c;filter:drop-shadow(0.012em 0.012em 0 #7d9a18) drop-shadow(0.012em 0.012em 0 #6c8615) drop-shadow(0.012em 0.012em 0 #5b7112) drop-shadow(0.012em 0.012em 0 #4a5d0f) drop-shadow(0.012em 0.012em 0 #3b4a0c) drop-shadow(0.03em 0.05em 0.03em rgba(0,0,0,.55))}
.npdrop{animation:npdrop .32s cubic-bezier(.6,0,1,.4) both, npq .35s .32s}
@keyframes npdrop{0%{translate:0 -90vh;rotate:-8deg}88%{scale:1.06 .94}100%{translate:0 0;rotate:-2deg}}
@keyframes npq{25%{translate:-6px 3px}50%{translate:5px -2px}75%{translate:-2px 1px}}
.fadeup{animation:fadeup .5s 1.3s both}
@keyframes fadeup{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}
.w1{animation:dropin .4s cubic-bezier(.6,0,1,.4) both}
.w2{animation:dropin .4s .7s cubic-bezier(.6,0,1,.4) both}
.quake2{animation:quake .45s .4s, quake .6s 1.1s}
@keyframes dropin{0%{translate:0 -130vh;scale:1.6}88%{scale:1.15 .8}100%{translate:0 0;scale:1}}
@keyframes quake{15%{translate:-22px 12px}30%{translate:12px -6px}45%{translate:-8px 4px}60%{translate:6px -2px}80%{translate:-2px 1px}}
.pulse{animation:pulse 1s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.06)}}
.slam{animation:slam .35s cubic-bezier(.2,1.6,.4,1)}
@keyframes slam{0%{scale:1.8;opacity:0}100%{scale:1;opacity:1}}
.blink{animation:blink .5s infinite}
@keyframes blink{50%{opacity:.4}}
.shake{animation:shk .35s}
@keyframes shk{20%{translate:-8px 0}40%{translate:8px 0}60%{translate:-5px 0}80%{translate:5px 0}}
.slideIn{animation:slideIn .4s ease-out both}
@keyframes slideIn{from{opacity:0;translate:-30px 0}to{opacity:1;translate:0 0}}
svg{display:block}
.up,.fried,.oops{transform:translateY(8%)}
.up svg,.fried svg,.oops svg{width:100%;height:auto}
.up{animation:up .16s ease-out}
@keyframes up{from{transform:translateY(100%)}to{transform:translateY(8%)}}
.fried{animation:fry .6s ease-in forwards}
@keyframes fry{0%{filter:none}30%{filter:sepia(1) saturate(5) hue-rotate(-25deg);scale:1.12}100%{filter:sepia(1) saturate(6) hue-rotate(-30deg) brightness(.5);transform:translateY(110%)}}
.oops{animation:oops .5s ease-in forwards}
@keyframes oops{25%{rotate:-12deg}50%{rotate:12deg}100%{transform:translateY(110%)}}
.tasa{position:absolute;left:50%;top:8%;translate:-50% 0;font-family:"Archivo Black",sans-serif;font-size:clamp(18px,3.6vw,34px);line-height:.95;text-align:center;white-space:nowrap;text-shadow:0 3px 0 #fff,0 -3px 0 #fff,3px 0 0 #fff,-3px 0 0 #fff;animation:tasa .7s ease-out forwards;pointer-events:none;z-index:5}
@keyframes tasa{0%{scale:.4;opacity:0}20%{scale:1.25;opacity:1}100%{translate:-50% -70%;opacity:0}}
.walker{position:absolute;z-index:2;width:clamp(48px,6.2vw,80px);transform:translate(-50%,-50%);cursor:pointer;animation:stroll 3.2s ease-in-out infinite alternate;touch-action:manipulation}
.walker svg{width:100%;height:auto}
@keyframes stroll{from{translate:-4px 0}to{translate:4px -3px}}
.walker.duda{z-index:3;scale:1.12}
.walker.duda svg{filter:drop-shadow(0 0 0 #7a5cff) drop-shadow(0 0 5px #7a5cff)}
.walker.duda:active{scale:1.1}
.walker.power{animation:pop .45s cubic-bezier(.2,1.6,.4,1),stroll 3.2s ease-in-out .45s infinite alternate}
@keyframes pop{0%{scale:1.6}100%{scale:1}}
.walker.power{z-index:3}
.walker.power svg{filter:drop-shadow(0 0 0 #c6f432) drop-shadow(0 0 6px #c6f432)}
.walker.neutral{cursor:default}
.qm{position:absolute;top:-40%;right:-22%;font-family:"Archivo Black",sans-serif;font-size:clamp(40px,6vw,72px);text-shadow:0 3px 0 #fff,0 -3px 0 #fff,3px 0 0 #fff,-3px 0 0 #fff;color:#7a5cff;animation:qm .9s ease-in-out infinite alternate}
@keyframes qm{to{rotate:20deg;translate:0 -4px}}
.bubbleTxt{position:absolute;bottom:100%;left:50%;translate:-50% -4px;white-space:nowrap;background:#fff;color:#111;border:2px solid #111;border-radius:10px;padding:3px 8px;font:800 13px Inter,sans-serif;pointer-events:none;z-index:4;animation:bubFade .5s ease-out both}
@keyframes bubFade{from{opacity:0;translate:-50% 4px}to{opacity:1;translate:-50% -4px}}
.bubbleTxt.power{animation:bubFade .5s ease-out both,bubOut 1.2s ease-in 4s forwards !important}
@keyframes bubOut{to{opacity:0}}
.bubbleTxt.power{background:${BIEN};color:#fff;border-color:#fff}
.tasaC{position:absolute;left:50%;top:50%;translate:-50% -50%;z-index:8;pointer-events:none;font-family:"Archivo Black",sans-serif;font-size:clamp(44px,10vw,120px);line-height:.9;text-align:center;white-space:nowrap;text-shadow:0 5px 0 #fff,0 -5px 0 #fff,5px 0 0 #fff,-5px 0 0 #fff;animation:tasaC 1.2s cubic-bezier(.2,1.5,.4,1) forwards}
.tasaX{animation:tasaX 1.3s cubic-bezier(.2,1.5,.4,1) forwards !important}
@keyframes tasaX{0%{scale:3;rotate:-12deg;opacity:0}15%{scale:1;rotate:3deg;opacity:1}22%{rotate:-3deg}30%{rotate:2deg}38%{rotate:0deg}85%{opacity:1;scale:1.05}100%{opacity:0;scale:1.1}}
@keyframes tasaC{0%{scale:2.4;opacity:0}15%{scale:1;opacity:1}85%{opacity:1}100%{scale:1.05;opacity:0}}
.alarm{animation:alarm .5s steps(2) infinite}
@keyframes alarm{50%{background:#ffd9d2;border-color:#e8452c}}
.warn{position:absolute;left:0;right:0;top:6%;z-index:7;pointer-events:none;background:#e8452c;color:#fff;font-family:"Archivo Black",sans-serif;font-size:clamp(30px,6.5vw,84px);line-height:.95;text-align:center;padding:10px 10px;opacity:.93;border-block:6px solid #141414;rotate:-3deg;text-shadow:0 4px 0 #141414;animation:warn .5s ease-in-out infinite alternate,warnIn .4s cubic-bezier(.5,0,.75,0) both}
@keyframes warn{from{scale:1}to{scale:1.06}}
.warn2{top:auto;bottom:8%;background:#c6f432;color:#141414;rotate:3deg;font-size:clamp(26px,5vw,64px);animation-delay:.5s,.5s}
@keyframes warnIn{from{translate:0 -100vh}to{translate:0 0}}
.nextArrow{margin-top:18px;display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;color:#c6f432;font:900 clamp(16px,2vw,22px) "Archivo Black",sans-serif;cursor:pointer;animation:nudge 1s ease-in-out infinite}
@keyframes nudge{50%{translate:0 6px}}
.hdrop{animation:hdrop .45s cubic-bezier(.5,0,.75,0) both}
@keyframes hdrop{0%{translate:0 -120vh;opacity:1}85%{translate:0 0;scale:1 .9}100%{translate:0 0;scale:1}}
h1 span,.tasaC,.warn,.big3d{text-shadow:.02em .02em 0 #141414,.04em .04em 0 #141414,.06em .06em 0 #141414,.08em .08em 0 #141414,.1em .11em .12em rgba(0,0,0,.35) !important;-webkit-text-stroke:.012em #141414}
.casiBub{display:flex;align-items:center;gap:8px;position:absolute;left:50%;top:calc(100% + 18px);translate:-50% 0;rotate:4deg;background:#fff;color:#141414;font:900 clamp(12px,1.5vw,17px)/1.1 "Archivo Black",sans-serif;padding:8px 12px;border:3px solid #141414;border-radius:14px;white-space:nowrap;text-shadow:none !important;-webkit-text-stroke:0;z-index:4;animation:bubIn .5s cubic-bezier(.2,1.6,.4,1) 1.8s both}
.casiBub::before{content:"";position:absolute;left:50%;top:-14px;translate:-50% 0;border:9px solid transparent;border-bottom:14px solid #141414;border-top:0}
@keyframes bubIn{from{scale:0;opacity:0}to{scale:1;opacity:1}}
.provBtn{animation:hdrop .45s cubic-bezier(.5,0,.75,0) both,provPulse 1.8s ease-in-out infinite}
.provWon{opacity:.85;background:#c6f432 !important;cursor:default}
.provBtn:hover{background:#c6f432 !important;scale:1.12;z-index:5 !important}
@keyframes provPulse{0%,100%{scale:1}50%{scale:1.08}}
.placeBg .drift{animation:drift 6s ease-in-out infinite alternate}
.placeBg .smoke,.provBtn .smoke{animation:smoke 3s ease-in-out infinite}
.placeBg .float1,.provBtn .float1{animation:float 4s ease-in-out infinite alternate}
.placeBg .float2,.provBtn .float2{animation:float 5s ease-in-out -2s infinite alternate}
.placeBg .road{animation:road 2s linear infinite}
.placeBg .lights,.provBtn .lights{animation:lights 1.2s steps(2) infinite}
.placeBg .banner,.placeBg .sway{animation:sway 3s ease-in-out infinite alternate;transform-origin:100px 40px}
.placeBg .blink2{animation:lights 2s steps(2) infinite}
@keyframes drift{to{translate:3px 0}}
@keyframes smoke{0%{opacity:.4;translate:0 4px}50%{opacity:1}100%{opacity:.3;translate:3px -6px}}
@keyframes float{to{translate:0 -6px}}
@keyframes road{to{translate:-18px 0}}
@keyframes lights{50%{opacity:.45}}
@keyframes sway{to{rotate:2deg}}
.pips{position:absolute;top:100%;left:50%;translate:-50% 4px;display:flex;gap:4px}
.pips i{width:11px;height:11px;border-radius:50%;background:#7a5cff;border:2px solid #141414}
.walker.hp2 svg{filter:drop-shadow(0 0 5px #c6a6ff)}
.walker.ally{cursor:pointer;z-index:3}
.walker.ally svg{filter:drop-shadow(0 0 0 #c6f432) drop-shadow(0 0 8px #c6f432);animation:allyPulse 1s ease-in-out infinite alternate}
@keyframes allyPulse{to{scale:1.08}}
.bubbleTxt.ally{background:#c6f432;border-color:#141414}
.walker.big{width:clamp(110px,15vw,180px);animation:none}
.walker.big .bubbleTxt{font-size:clamp(13px,1.5vw,18px);padding:6px 12px;white-space:normal;width:max-content;max-width:clamp(150px,24vw,300px);text-align:center;border-width:3px;border-radius:14px}
.walker.big .pips i{width:16px;height:16px}
.walker.triste svg{filter:grayscale(.7) drop-shadow(0 0 6px #8aa0c0)}
.mult{position:absolute;top:-6%;right:-14%;background:#c6f432;border:3px solid #141414;border-radius:999px;font:900 22px "Archivo Black",sans-serif;padding:2px 10px;animation:pop .4s}
.walker.solo{width:clamp(170px,24vw,280px)}
.walker.solo svg{filter:none !important}
.walker.solo .bubbleTxt{font-size:clamp(16px,2.2vw,26px);max-width:clamp(240px,40vw,520px)}
.walker.solo.power .bubbleTxt{animation:bubFade .5s ease-out both !important}
.dato{position:absolute;left:50%;bottom:5%;translate:-50% 0;z-index:7;width:min(90%,820px);background:#141414;color:#c6f432;font:900 clamp(16px,2.2vw,26px)/1.15 "Archivo Black",sans-serif;text-align:center;padding:12px 20px;border-radius:14px;pointer-events:none;animation:bubFadeD .4s ease-out both}
@keyframes bubFadeD{from{opacity:0;translate:-50% 12px}to{opacity:1;translate:-50% 0}}
.joke{position:absolute;left:50%;top:84%;translate:-50% -50%;z-index:9;pointer-events:none;width:min(88%,900px);background:#fff;color:#141414;border:5px solid #141414;border-radius:20px;padding:14px 22px;text-align:center;font:900 clamp(22px,3.8vw,46px)/1.1 "Archivo Black",sans-serif;rotate:-2deg;animation:pop .45s cubic-bezier(.2,1.6,.4,1)}
.epic .rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.09) 0 10deg,transparent 10deg 20deg);animation:spin 18s linear infinite}
@keyframes spin{to{rotate:360deg}}
.confeti{position:absolute;top:-20px;width:12px;height:20px;border-radius:2px;animation:fall 3s linear infinite;opacity:.9}
@keyframes fall{0%{translate:0 -10vh;rotate:0deg}100%{translate:30px 110vh;rotate:720deg}}
.medal{background:#fff;border:6px solid #141414;border-radius:26px;padding:10px 24px;text-align:center;min-width:clamp(220px,26vw,330px);box-shadow:0 0 0 8px #c6f432,10px 12px 0 8px #141414;animation:hdrop .5s cubic-bezier(.5,0,.75,0) both,medalGlow 1.6s ease-in-out infinite alternate}
@keyframes medalGlow{to{scale:1.04;rotate:-1deg}}
.argPanel{position:absolute;left:50%;top:0;width:50%;height:100%;box-sizing:border-box;z-index:6;background:#fff;border-left:4px dashed #141414;padding:24px 28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;animation:bubFadeD2 .45s ease-out both}
@keyframes bubFadeD2{from{opacity:0;translate:20px 0}to{opacity:1;translate:0 0}}
.ballotBtn{width:clamp(120px,13vw,170px);aspect-ratio:3/4;background:#fff;border:4px solid #141414;border-radius:8px;box-shadow:inset 0 0 0 10px #c6f432,4px 6px 0 #141414;font:900 clamp(22px,2.8vw,34px)/1 "Archivo Black",sans-serif;color:#141414;cursor:pointer;animation:provPulse 1.2s ease-in-out infinite;touch-action:manipulation}
.ballotBtn:active{scale:.94}
.armedSlow{animation:armIn 2.8s steps(1) both}
.ballotBtn.armed{animation:armIn 1.3s steps(1) both,provPulse 1.2s ease-in-out 1.3s infinite}
@keyframes armIn{0%{opacity:.25;pointer-events:none}100%{opacity:1;pointer-events:auto}}
.bgCrowd,.bgFire,.bgFlags,.bgCity{position:absolute;inset:0;pointer-events:none;opacity:.5}
.jumper{position:absolute;bottom:-2%;width:9vw;max-width:110px;animation:jump .7s ease-in-out infinite alternate}
.jumper svg{width:100%;height:auto}
@keyframes jump{to{translate:0 -40px}}
.burst{position:absolute;width:0;height:0;animation:burst 2.2s ease-out infinite}
.burst i{position:absolute;width:6px;height:60px;background:currentColor;border-radius:3px;transform-origin:3px 0;translate:-3px 0}
@keyframes burst{0%{scale:0;opacity:1}60%{scale:1.6;opacity:1}100%{scale:2;opacity:0}}
.flag{position:absolute;top:-4%;width:8%;height:42%;border:4px solid #141414;border-top:none;clip-path:polygon(0 0,100% 0,100% 100%,50% 86%,0 100%);animation:wave 1.4s ease-in-out infinite alternate;transform-origin:top center;display:flex;align-items:center;justify-content:center}
.flag span{font:900 clamp(12px,1.6vw,22px) "Archivo Black",sans-serif;color:#e8452c;writing-mode:vertical-rl}
@keyframes wave{from{rotate:-4deg}to{rotate:4deg}}
.bldg{position:absolute;bottom:0;width:9%;background:#141414;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:8px;align-content:start}
.bldg i{height:14px;background:#333;animation:lightOn 4s steps(1) infinite}
@keyframes lightOn{0%{background:#333}30%,100%{background:#c6f432}}
.idleAd{position:absolute;left:50%;top:50%;translate:-50% -50%;z-index:8;pointer-events:none;width:min(90%,1000px);background:#e8452c;color:#c6f432;border:6px solid #141414;border-radius:24px;padding:18px 24px;text-align:center;font:900 clamp(30px,6vw,80px)/1 "Archivo Black",sans-serif;text-shadow:.04em .05em 0 #141414;rotate:-3deg;animation:pop .45s cubic-bezier(.2,1.6,.4,1),idleP 1s ease-in-out .45s infinite alternate;opacity:.95}
@keyframes idleP{to{scale:1.05}}
.idleSit{position:absolute;left:92%;top:78%;width:clamp(80px,9vw,120px);translate:-50% 0;z-index:4;cursor:pointer}
.idleBody{width:100%;height:auto;display:block}
.headDown{transform-origin:30px 26px;animation:sigh 3s ease-in-out infinite}
@keyframes sigh{0%,100%{rotate:12deg}50%{rotate:18deg;translate:0 1px}}
.idleBub{font-size:13px !important;bottom:100% !important;white-space:normal !important;width:max-content;max-width:200px;text-align:center;z-index:6}
.pebble{position:absolute;bottom:1px;left:110%;width:8px;height:6px;border-radius:50%;background:#555;border:1px solid #141414;animation:kick 3s ease-out infinite}
@keyframes idleWalk{0%{left:10%}50%{left:88%}100%{left:10%}}
@keyframes idleFlip{0%{scale:1 1}50%{scale:-1 1}}
@keyframes bob{to{translate:0 -1.5px}}
@keyframes legs{from{rotate:-14deg}to{rotate:14deg}}
@keyframes kick{0%,70%{translate:0 0}80%{translate:12px -4px}100%{translate:22px 0}}
.walkerMap{position:absolute;z-index:8;width:clamp(60px,7vw,90px);translate:-50% -70%;animation:runTo 2s cubic-bezier(.4,0,.3,1) both;pointer-events:none}
.walkerMap svg{width:100%;height:auto}
.walkerMap .bubbleTxt{animation:none}
@keyframes runTo{0%{left:88%;top:84%;scale:1}20%{left:86%;top:80%;scale:1.9}80%{left:var(--tx);top:var(--ty);scale:1.5;opacity:1}100%{left:var(--tx);top:var(--ty);scale:0;opacity:0}}
.tvFlicker{animation:lights .8s steps(2) infinite}
.fachaVest{position:absolute;left:12%;right:12%;bottom:4%;height:26%;background:#2b3a2b;border:3px solid #141414;border-radius:30% 30% 8px 8px;clip-path:polygon(0 0,40% 0,50% 40%,60% 0,100% 0,100% 100%,0 100%)}
.fachaVest i{position:absolute;left:62%;top:30%;width:22%;height:16%;background:linear-gradient(#c60b1e 0 25%,#ffc400 25% 75%,#c60b1e 75%);border:1px solid #141414}
.envFlap{position:absolute;left:0;right:0;top:0;height:70%;background:#c6f432;clip-path:polygon(0 0,100% 0,50% 62%);border-bottom:none;pointer-events:none}
.envFlap::after{content:"";position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 62%,50% 58%,96% 0,4% 0,50% 58%);background:#141414}
.peek.peek-m{width:clamp(90px,26vw,150px);height:clamp(90px,26vw,150px);translate:-50% -50%;border-radius:50%;background:#f3ece2;border:3px solid #141414;overflow:hidden}
.peek.peek-m .peekIn{animation:peekUpM .3s cubic-bezier(.2,1.4,.4,1) both}
.peek .peekIn svg{width:100%;height:100%;display:block}
@keyframes peekUpM{from{transform:translateY(100%)}to{transform:translateY(0)}}
@media (max-width:760px){
.argPanel{left:0 !important;width:100% !important;top:50% !important;height:50% !important;border-left:none !important;border-top:4px dashed #141414 !important;padding:12px 16px !important}
.ballotBtn{width:clamp(96px,26vw,130px)}
.walker.solo{width:clamp(130px,38vw,190px)}
.walker.solo .bubbleTxt{font-size:15px;max-width:80vw}
.ballot{width:clamp(70px,20vw,110px);font-size:18px}
.provBtn,.provWon{padding:2px 4px !important;font-size:8px !important;border-width:1.5px !important}
.medal{min-width:150px;padding:6px 12px}
.medal .big3d{font-size:44px !important}
.idleFace{width:62px}
.idleFace .idleBub{max-width:110px !important;font-size:11px !important}
.walkerMap{display:none}
.warn{font-size:clamp(22px,8vw,40px)}
.tasaC{font-size:clamp(34px,11vw,60px)}
}
.pop{position:absolute;width:calc(clamp(104px,27vmin,200px) * var(--sz));aspect-ratio:1;translate:-50% -50%;z-index:2;animation:popGrow 2.6s ease-out both}
.popIn{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#f3ece2;border:3px solid #141414;cursor:pointer;touch-action:manipulation}
.popIn svg{width:100%;height:100%;display:block}
@keyframes popGrow{0%{scale:0}12%{scale:1.08}20%{scale:1}100%{scale:var(--gr)}}
.go{position:relative;overflow:hidden;background:#c6f432;color:#141414;border:4px solid #141414;border-radius:999px;font:900 clamp(20px,3vw,30px) "Archivo Black",sans-serif;padding:14px 40px;cursor:pointer;box-shadow:4px 5px 0 #141414;min-width:min(80vw,340px)}
.go .fill{position:absolute;left:0;top:0;bottom:0;background:rgba(20,20,20,.15);animation:fillGo 10s linear forwards}
@keyframes fillGo{from{width:0}to{width:100%}}
.go span{position:relative}
.mini{display:flex;gap:10px;justify-content:center;margin-top:12px}
.mini button,.mini a{background:transparent;color:#fff;border:2px solid #fff;border-radius:999px;font:800 15px Inter,sans-serif;padding:8px 18px;cursor:pointer;text-decoration:none}
.pdot{position:absolute;translate:-50% -50%;display:flex;flex-direction:column;align-items:center}
.pdot i{width:clamp(14px,1.8vw,22px);height:clamp(14px,1.8vw,22px);border-radius:50%;border:2px solid #141414;animation:dotP 1.4s ease-in-out infinite}
@keyframes dotP{0%,100%{scale:.8}50%{scale:1.35;box-shadow:0 0 0 6px rgba(139,92,246,.35)}}
.pdot span{margin-top:3px;font:900 clamp(9px,1.1vw,13px) "Archivo Black",sans-serif;color:#141414;background:rgba(255,255,255,.85);padding:1px 5px;border-radius:6px;white-space:nowrap}
.pdot:hover i{scale:1.5}
.pinfo{position:absolute;bottom:calc(100% + 6px);background:#141414;color:#c6f432;font:900 clamp(12px,1.5vw,16px)/1.2 "Archivo Black",sans-serif;padding:8px 12px;border-radius:10px;white-space:nowrap;text-align:center;animation:pop .3s}
.titleMove{animation:hdrop .5s cubic-bezier(.5,0,.75,0) both,tMove 2.4s ease-in-out .6s infinite}
@keyframes tMove{0%,100%{rotate:-2deg;scale:1}50%{rotate:2deg;scale:1.06}}
.bandMove{rotate:-2deg;animation:bandIn .5s cubic-bezier(.2,1.5,.4,1) .45s both,bandW 1.8s ease-in-out 1s infinite alternate}
@keyframes bandIn{from{translate:-120vw 0}to{translate:0 0}}
@keyframes bandW{from{translate:-6px 0}to{translate:6px 0}}
.idleFace{position:absolute;width:clamp(64px,8vw,100px);translate:-50% -50%;z-index:5;cursor:pointer;animation:faceBob 2.6s ease-in-out infinite alternate}
@keyframes faceBob{to{translate:-50% -56%}}
.faceC{width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;background:#f3ece2;border:3px solid #141414;box-shadow:3px 4px 0 #141414}
.faceC svg{width:100%;height:100%;display:block}
.voteCard{width:min(100%,460px);background:#fff;border:5px solid #141414;border-radius:14px;box-shadow:inset 0 0 0 10px #c6f432,6px 8px 0 #141414;padding:22px 22px 16px;cursor:pointer;display:flex;flex-direction:column;gap:10px;align-items:center;touch-action:manipulation;color:#141414}
.voteCard:active{scale:.97}
.voteCard.armed{animation:armIn 1.3s steps(1) both,cardP 1.4s ease-in-out 1.3s infinite}
@keyframes cardP{50%{scale:1.03}}
.vcHead{font:900 clamp(30px,4.5vw,56px)/1 "Archivo Black",sans-serif;color:#e8452c}
.vcText{font:900 clamp(18px,2.6vw,30px)/1.15 "Archivo Black",sans-serif}
.vcTap{font:800 13px Inter,sans-serif;opacity:.6;text-transform:uppercase;letter-spacing:1px}
.ptag{position:absolute;top:calc(100% + 10px);left:50%;translate:-50% 0;white-space:nowrap;color:#fff;font:900 clamp(11px,1.4vw,15px) "Archivo Black",sans-serif;padding:4px 12px;border:2px solid #141414;border-radius:999px;z-index:5}
.rewardCard{box-sizing:border-box;width:min(88vw,440px);background:linear-gradient(160deg,#fff 0,#f3ece2 100%);border:6px solid #141414;border-radius:22px;box-shadow:0 0 0 8px #c6f432,0 0 60px #c6f432;padding:20px;text-align:center;animation:cardIn .7s cubic-bezier(.2,1.5,.4,1) both}
@keyframes cardIn{from{rotate:-30deg;scale:0}to{rotate:-2deg;scale:1}}
.shipBody{animation:sink 6s ease-in forwards;transform-origin:150px 120px}
@keyframes sink{0%{translate:0 0;rotate:0deg}30%{rotate:8deg}100%{translate:0 90px;rotate:24deg}}
.wave{animation:wv 1.2s ease-in-out infinite alternate}
@keyframes wv{to{translate:-12px 0}}
.statsRow{position:relative;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0 4px;max-width:900px}
.statsRow div{background:#141414;color:#fff;border-radius:12px;padding:6px 12px;display:flex;flex-direction:column;align-items:center;min-width:96px}
.statsRow b{font:900 clamp(18px,2.6vw,28px) "Archivo Black",sans-serif;color:#c6f432}
.statsRow span{font:800 11px Inter,sans-serif;text-transform:uppercase}
.rocket{position:absolute;left:8%;bottom:-30%;width:clamp(50px,7vw,90px);z-index:0;animation:launch 5s cubic-bezier(.5,0,.6,1) 1s infinite;pointer-events:none}
@keyframes launch{0%{translate:0 0;rotate:10deg}100%{translate:80vw -170vh;rotate:28deg}}
.flame{animation:fl .12s steps(2) infinite}
@keyframes fl{50%{opacity:.4}}
.peek{position:absolute;width:clamp(150px,30vmin,280px);height:clamp(150px,30vmin,280px);z-index:2}
.peek-t{top:0;translate:-50% 0;rotate:180deg}.peek-b{bottom:0;translate:-50% 0}
.peek-l{left:0;translate:0 -50%;rotate:90deg}.peek-r{right:0;translate:0 -50%;rotate:-90deg}
.peekIn{position:absolute;inset:0;cursor:pointer;animation:peekUp .35s cubic-bezier(.2,1.4,.4,1) both}
@keyframes peekUp{from{transform:translateY(100%)}to{transform:translateY(30%)}}
.peek .tasa{rotate:0deg}
.peek-t .tasa{rotate:180deg}.peek-l .tasa{rotate:-90deg}.peek-r .tasa{rotate:90deg}
.ballot{position:absolute;z-index:6;pointer-events:none;width:clamp(120px,15vw,190px);aspect-ratio:3/4;background:#fff;border:3px solid #141414;border-radius:6px;display:grid;place-items:center;text-align:center;font:900 clamp(22px,3vw,38px)/1 "Archivo Black",sans-serif;color:#141414;box-shadow:inset 0 0 0 10px #c6f432;animation:ballot .9s cubic-bezier(.2,.8,.3,1) forwards}
@keyframes ballot{0%{translate:-50% -260%;rotate:-25deg;opacity:0}35%{translate:-50% -90%;rotate:6deg;opacity:1}70%{translate:-50% -80%;rotate:0deg;scale:1.05}100%{translate:-50% -80%;scale:.6;opacity:0}}
.rayold{position:absolute;top:0;width:28px;height:100%;translate:-50% 0;background:linear-gradient(transparent,#bfe0ff 20%,#fff 50%,#4da3ff);box-shadow:0 0 24px 10px rgba(77,163,255,.7);animation:ray .5s ease-out forwards;pointer-events:none;z-index:4;border-radius:14px}
@keyframes ray{0%{opacity:0;scale:1 0;transform-origin:top}30%{opacity:1;scale:1 1}100%{opacity:0;scale:2.5 1}}
.mouth{transform-box:fill-box;transform-origin:center;animation:talk .28s ease-in-out infinite alternate}
.m1{animation-duration:.22s}.m2{animation-duration:.34s;animation-delay:.1s}
@keyframes talk{to{transform:scaleY(.35)}}
`;
