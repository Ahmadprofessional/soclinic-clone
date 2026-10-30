// Prints a compact outline of every page's Elementor widget tree, plus a widget-type census.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const rawDir = path.resolve("docs/research/raw");
const outDir = path.resolve("docs/research/pages");
fs.mkdirSync(outDir, { recursive: true });
const census = {};

for (const f of fs.readdirSync(rawDir).filter((f) => f.endsWith(".html"))) {
  const $ = cheerio.load(fs.readFileSync(path.join(rawDir, f), "utf8"));
  const lines = [];
  const walk = (el, depth) => {
    const $el = $(el);
    const type = $el.attr("data-element_type");
    const widget = $el.attr("data-widget_type");
    if (type) {
      const id = $el.attr("data-id");
      const w = widget ? widget.replace(".default", "") : type;
      census[w] = (census[w] || 0) + 1;
      let info = "";
      if (widget) {
        const text = $el.text().replace(/\s+/g, " ").trim().slice(0, 140);
        const href = $el.find("a").first().attr("href");
        const img = $el.find("img").first().attr("src");
        info = ` "${text}"${href ? " -> " + href : ""}${img ? " [img " + img.split("/").slice(-1)[0] + "]" : ""}`;
      }
      lines.push(`${"  ".repeat(depth)}${w}#${id}${info}`);
      if (!widget) $el.children().each((_, c) => walk(c, depth + 1));
      return;
    }
    $el.children().each((_, c) => walk(c, depth));
  };
  for (const root of ["header.elementor-location-header", "[data-elementor-type]:not([data-elementor-type=header]):not([data-elementor-type=footer])", "footer.elementor-location-footer"]) {
    lines.push(`## ${root.split(",")[0]}`);
    $(root).first().children().each((_, c) => walk(c, 0));
  }
  fs.writeFileSync(path.join(outDir, f.replace(".html", ".outline.txt")), lines.join("\n"));
}
console.log(JSON.stringify(census, null, 1));
