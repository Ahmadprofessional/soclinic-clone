// Collects every stylesheet (linked + inline) the live pages use, localises url() assets,
// and writes one public/wp.css so the clone renders with the original Elementor styling.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const ORIGIN = "https://soclinic.uk";
const rawDir = path.resolve("docs/research/raw");
const seen = new Map(); // key -> css text (insertion order = first appearance)
const assets = new Map(); // abs url -> local path

const localise = async (css, baseUrl) => {
  const re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
  const jobs = [];
  css = css.replace(re, (m, q, u) => {
    if (u.startsWith("data:") || u.startsWith("#")) return m;
    let abs;
    try { abs = new URL(u, baseUrl).href; } catch { return m; }
    if (!abs.startsWith(ORIGIN)) return m; // Google Fonts etc. stay remote-free (handled by next/font)
    const clean = abs.split("#")[0].split("?")[0];
    const rel = new URL(clean).pathname.replace(/^\//, "");
    const local = "/wp/" + rel;
    if (!assets.has(clean)) { assets.set(clean, local); jobs.push(clean); }
    return `url("${local}")`;
  });
  return css;
};

const files = fs.readdirSync(rawDir).filter((f) => f.endsWith(".html"));
// home first so its cascade order wins
files.sort((a, b) => (a === "home.html" ? -1 : b === "home.html" ? 1 : 0));

for (const f of files) {
  const $ = cheerio.load(fs.readFileSync(path.join(rawDir, f), "utf8"));
  const nodes = $("link[rel=stylesheet], style").toArray();
  for (const n of nodes) {
    const $n = $(n);
    if (n.tagName === "link") {
      const href = $n.attr("href");
      if (!href || !href.startsWith(ORIGIN)) continue; // external google fonts etc.
      const key = href.split("?")[0];
      if (seen.has(key)) continue;
      const media = ($n.attr("media") || "all").trim();
      try {
        const css = await (await fetch(href)).text();
        const local = await localise(css, href);
        // keep responsive sheets (e.g. WooCommerce small-screen) scoped to their media query
        seen.set(key, media === "all" || !media ? local : `@media ${media} {\n${local}\n}`);
      } catch (e) { console.log("css fail", href); }
    } else {
      const css = $n.html();
      if (!css || css.length < 20) continue;
      const key = "inline:" + (n.attribs.id || css.slice(0, 60));
      if (seen.has(key)) continue;
      seen.set(key, await localise(css, ORIGIN + "/"));
    }
  }
}

let ok = 0;
for (const [abs, local] of assets) {
  const dest = path.resolve("public", local.replace(/^\//, ""));
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) continue;
    const r = await fetch(abs);
    if (!r.ok) throw new Error(r.status);
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    ok++;
  } catch (e) { console.log("asset fail", abs, e.message); }
}

// Legacy IE hacks (`*display: inline;`) and keys that would break the comment banner.
const clean = (css) => css.replace(/﻿/g, "").replace(/(^|[;{\s])[*_][a-z-]+\s*:[^;}]*;?/gim, "$1");
const out = [...seen.entries()]
  .map(([k, v]) => `/* ${k.replace(/\*\//g, "").replace(/\/\*/g, "").slice(0, 80).replace(/\s+/g, " ")} */\n${clean(v)}`)
  .join("\n\n");
fs.writeFileSync(path.resolve("public/wp.css"), out);
console.log(`stylesheets=${seen.size} bytes=${out.length} newAssets=${ok}`);
