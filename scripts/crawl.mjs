// Fetches every page of soclinic.uk as raw HTML, the Elementor CSS that styles it,
// and every wp-content image they reference. Output: docs/research/raw/, public/wp/
import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://soclinic.uk";
const PAGES = [
  "/", "/about-us/", "/services/", "/packages/", "/our-approach/", "/products/",
  "/contact-us/", "/testimonials/", "/blog/", "/shop/", "/cart/", "/checkout/",
  "/my-account/", "/shop-page/", "/our-team/", "/resources/", "/get-discount/",
  "/privacy-policy/",
  "/how-to-build-a-smoothie-to-fight-inflammation/",
  "/top-tips-for-gut-health-from-nutritionists/",
  "/why-do-we-start-with-liver-support-in-our-clinic/",
  "/product/so-sleepy-tea/", "/category/blog/", "/product-category/tea/",
];

const rawDir = path.resolve("docs/research/raw");
await fs.mkdir(rawDir, { recursive: true });

const slugOf = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "__"));
const assetUrls = new Set();
const cssUrls = new Set();

for (const p of PAGES) {
  const res = await fetch(ORIGIN + p, { headers: { "user-agent": "Mozilla/5.0" } });
  const html = await res.text();
  await fs.writeFile(path.join(rawDir, slugOf(p) + ".html"), html);
  console.log(res.status, p, html.length);
  for (const m of html.matchAll(/https?:\/\/soclinic\.uk\/wp-content\/[^\s"'()<>\\,]+/g)) {
    const u = m[0].replace(/&amp;/g, "&");
    if (/\.css(\?|$)/.test(u)) cssUrls.add(u);
    else if (/\.(png|jpe?g|webp|gif|svg|avif|ico|mp4|webm)(\?|$)/i.test(u)) assetUrls.add(u);
  }
}

// Elementor / theme CSS (also scanned for background images)
const cssDir = path.join(rawDir, "css");
await fs.mkdir(cssDir, { recursive: true });
for (const u of cssUrls) {
  if (!/elementor\/css|uploads|hello-elementor|ekit|elementskit/.test(u)) continue;
  try {
    const css = await (await fetch(u)).text();
    const name = u.split("/").slice(-1)[0].split("?")[0];
    await fs.writeFile(path.join(cssDir, name), css);
    for (const m of css.matchAll(/url\(["']?(https?:\/\/soclinic\.uk\/wp-content\/[^"')]+)["']?\)/g)) {
      if (/\.(png|jpe?g|webp|gif|svg|avif|mp4|webm)(\?|$)/i.test(m[1])) assetUrls.add(m[1]);
    }
  } catch (e) {
    console.log("css fail", u, e.message);
  }
}

// Download assets with 4 parallel workers
const list = [...assetUrls];
let i = 0, ok = 0, fail = 0;
async function worker() {
  while (i < list.length) {
    const u = list[i++];
    const rel = new URL(u).pathname.replace(/^\/wp-content\//, "");
    const dest = path.resolve("public/wp", rel);
    try {
      await fs.mkdir(path.dirname(dest), { recursive: true });
      const r = await fetch(u);
      if (!r.ok) throw new Error(String(r.status));
      await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
      ok++;
    } catch (e) {
      fail++;
      console.log("asset fail", u, e.message);
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
console.log(`assets ok=${ok} fail=${fail} total=${list.length}`);
