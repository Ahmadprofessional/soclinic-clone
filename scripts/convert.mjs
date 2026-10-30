// Converts the downloaded WordPress/Elementor HTML into React (TSX) components.
// Header + footer become shared components; each page's body becomes src/content/<slug>.tsx.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const rawDir = path.resolve("docs/research/raw");
const contentDir = path.resolve("src/content");
const compDir = path.resolve("src/components");
fs.mkdirSync(contentDir, { recursive: true });
fs.mkdirSync(compDir, { recursive: true });

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const ATTR = {
  class: "className", for: "htmlFor", tabindex: "tabIndex", srcset: "srcSet", colspan: "colSpan",
  rowspan: "rowSpan", maxlength: "maxLength", readonly: "readOnly", autocomplete: "autoComplete",
  autofocus: "autoFocus", enctype: "encType", novalidate: "noValidate", crossorigin: "crossOrigin",
  frameborder: "frameBorder", allowfullscreen: "allowFullScreen", cellpadding: "cellPadding",
  cellspacing: "cellSpacing", datetime: "dateTime", inputmode: "inputMode", playsinline: "playsInline",
  referrerpolicy: "referrerPolicy", fetchpriority: "fetchPriority", "accept-charset": "acceptCharset",
  viewbox: "viewBox", "xlink:href": "xlinkHref", "xml:space": "xmlSpace", "xmlns:xlink": "xmlnsXlink",
  preserveaspectratio: "preserveAspectRatio", itemtype: "itemType", itemprop: "itemProp", itemid: "itemID", itemref: "itemRef", "http-equiv": "httpEquiv", contenteditable: "contentEditable",
};
const BOOL = new Set(["disabled", "checked", "selected", "required", "multiple", "hidden", "readonly", "autofocus", "allowfullscreen", "controls", "loop", "muted", "autoplay", "playsinline", "novalidate", "open"]);

const rewriteUrl = (u) =>
  u
    .replace(/https?:\/\/soclinic\.uk\/wp-content\//g, "/wp/")
    .replace(/https?:\/\/soclinic\.uk\/wp-includes\//g, "/wp-includes/")
    .replace(/https?:\/\/soclinic\.uk(?=\/|$)/g, "")
    .replace(/^$/, "/");

const rewriteSrcset = (s) => s.split(",").map((p) => { const [u, ...r] = p.trim().split(/\s+/); return [rewriteUrl(u), ...r].join(" "); }).join(", ");

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const styleObj = (s) => {
  const parts = s.split(";").map((x) => x.trim()).filter(Boolean).map((decl) => {
    const i = decl.indexOf(":");
    const k = decl.slice(0, i).trim();
    let v = decl.slice(i + 1).trim().replace(/https?:\/\/soclinic\.uk\/wp-content\//g, "/wp/");
    const key = k.startsWith("--") ? JSON.stringify(k) : camel(k.replace(/^-ms-/, "ms-"));
    return `${key}: ${JSON.stringify(v)}`;
  });
  return `{${parts.join(", ")}}`;
};

const esc = (t) => t.replace(/[{}<>]/g, (c) => `{${JSON.stringify(c)}}`).replace(/ /g, " ");

function attrs(el, tag) {
  const out = [];
  for (const [name, raw] of Object.entries(el.attribs || {})) {
    let n = name.toLowerCase();
    let v = raw;
    if (n.startsWith("on")) continue; // inline handlers dropped; behaviour handled by React
    if (n.startsWith("xmlns:") || n === "xlink") continue;
    if (n === "href" && !["a", "area", "link"].includes(tag)) continue;
    if (n === "itemscope") { out.push("itemScope"); continue; }
    if (n === "style") { out.push(`style={${styleObj(v)} as React.CSSProperties}`); continue; }
    if (/^aria-(level|colcount|rowcount|colindex|rowindex|posinset|setsize|valuenow|valuemin|valuemax)$/.test(n) && /^-?\d+(\.\d+)?$/.test(v)) {
      out.push(`${n}={${v}}`);
      continue;
    }
    if (n === "href" || n === "src" || n === "action" || n === "poster" || n === "data-src") v = rewriteUrl(v);
    if (n === "srcset") v = rewriteSrcset(v);
    if (n === "data-settings" || n.startsWith("data-") || n.startsWith("aria-")) {
      v = v.replace(/https?:\/\/soclinic\.uk\/wp-content\//g, "/wp/");
    }
    let jsx = ATTR[n] || (n.startsWith("data-") || n.startsWith("aria-") ? n : camel(n));
    if (tag === "input" && n === "value") jsx = "defaultValue";
    if (tag === "input" && n === "checked") jsx = "defaultChecked";
    if (tag === "textarea" && n === "value") jsx = "defaultValue";
    if (BOOL.has(n) && (v === "" || v === n)) { out.push(jsx); continue; }
    if (["tabIndex", "colSpan", "rowSpan", "maxLength", "size", "cols", "rows", "span", "start"].includes(jsx) && /^-?\d+$/.test(v)) {
      out.push(`${jsx}={${v}}`);
      continue;
    }
    // JSX string attributes have no backslash escapes, so anything awkward goes in an expression.
    out.push(/["\\\n\r{}]/.test(v) || v.includes("&") ? `${jsx}={${JSON.stringify(v)}}` : `${jsx}="${v}"`);
  }
  return out.length ? " " + out.join(" ") : "";
}

function toJsx(node, $) {
  if (node.type === "comment" || node.type === "directive") return "";
  if (node.type === "text") {
    const t = node.data;
    if (!t.trim() && t.includes("\n")) return "";
    return esc(t);
  }
  if (node.type !== "tag") return "";
  const tag = node.tagName.toLowerCase();
  if (["script", "style", "noscript", "link", "meta"].includes(tag)) return "";
  if (tag === "textarea") {
    return `<textarea${attrs(node, tag)} defaultValue=${JSON.stringify($(node).text())} />`;
  }
  const a = attrs(node, tag);
  if (VOID.has(tag)) return `<${tag}${a} />`;
  const kids = (node.children || []).map((c) => toJsx(c, $)).join("");
  return `<${tag}${a}>${kids}</${tag}>`;
}

const wrap = (name, jsx, client) =>
  `${client ? '"use client";\n\n' : ""}/* eslint-disable */\n// Generated by scripts/convert.mjs from the live soclinic.uk markup.\nexport default function ${name}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;

const pascal = (slug) => slug.split(/[^a-z0-9]+/i).filter(Boolean).map((s) => s[0].toUpperCase() + s.slice(1)).join("");

const pages = fs.readdirSync(rawDir).filter((f) => f.endsWith(".html"));
let headerDone = false;
const manifest = [];

for (const f of pages) {
  const slug = f.replace(".html", "");
  const $ = cheerio.load(fs.readFileSync(path.join(rawDir, f), "utf8"), { decodeEntities: true });

  if (!headerDone && slug === "home") {
    const h = $("header.elementor-location-header").get(0);
    const ft = $("footer.elementor-location-footer").get(0);
    fs.writeFileSync(path.join(compDir, "SiteHeader.tsx"), wrap("SiteHeader", toJsx(h, $), false));
    fs.writeFileSync(path.join(compDir, "SiteFooter.tsx"), wrap("SiteFooter", toJsx(ft, $), false));
    headerDone = true;
  }

  // Blog posts use a second header template (elementor-620).
  if (slug === "how-to-build-a-smoothie-to-fight-inflammation") {
    const h = $("header.elementor-location-header").get(0);
    fs.writeFileSync(path.join(compDir, "SiteHeaderPost.tsx"), wrap("SiteHeaderPost", toJsx(h, $), false));
  }

  const parts = [];
  $("body").children().each((_, el) => {
    const cls = el.attribs?.class || "";
    if (["script", "style", "link", "noscript"].includes(el.tagName)) return;
    if (cls.includes("skip-link") || cls.includes("elementor-location-header") || cls.includes("elementor-location-footer")) return;
    if (cls.includes("pswp") || cls.includes("elementor-device-mode")) return;
    if (el.tagName === "span" && cls.includes("elementor-screen-only")) return;
    parts.push(toJsx(el, $));
  });
  const name = (pascal(slug) || "Home") + "Content";
  fs.writeFileSync(path.join(contentDir, slug + ".tsx"), wrap(name, parts.join("\n"), false));
  const bodyClass = $("body").attr("class") || "";
  manifest.push({ slug, name, bodyClass, title: $("title").text() });
}
fs.writeFileSync("docs/research/manifest.json", JSON.stringify(manifest, null, 1));
console.log("converted", manifest.length, "pages");
