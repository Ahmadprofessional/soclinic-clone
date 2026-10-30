// Smoke test: every route answers 200 and every /wp/ asset it references exists in public/.
import fs from "node:fs";

const base = process.argv[2] || "http://localhost:3100";
const routes = JSON.parse(fs.readFileSync("docs/research/manifest.json", "utf8")).map((m) =>
  m.slug === "home" ? "/" : "/" + m.slug.replace(/__/g, "/"),
);
const missing = new Set();
for (const r of routes) {
  const res = await fetch(base + r);
  if (res.status !== 200) console.log("STATUS", res.status, r);
  const html = await res.text();
  for (const m of html.matchAll(/(\/(?:wp|wp-includes)\/[^"'\s),\\]+)/g)) {
    const p = decodeURIComponent(m[1].split("?")[0]);
    if (!fs.existsSync("public" + p)) missing.add(`${p}  <- ${r}`);
  }
}
console.log(missing.size ? [...missing].join("\n") : `all ${routes.length} routes OK, no missing local assets`);
