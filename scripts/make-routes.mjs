// Generates src/app/<route>/page.tsx for every converted page, wrapping the content in PageShell
// (which applies the original WordPress body classes the Elementor CSS keys off).
import fs from "node:fs";
import path from "node:path";

const manifest = JSON.parse(fs.readFileSync("docs/research/manifest.json", "utf8"));
const routeOf = (slug) => (slug === "home" ? "" : slug.replace(/__/g, "/"));
const stripBody = (c) => c.split(/\s+/).filter((x) => x && !/^(logged-in|admin-bar|customize-support)$/.test(x)).join(" ");

for (const { slug, name, bodyClass, title } of manifest) {
  const route = routeOf(slug);
  const dir = path.resolve("src/app", route);
  fs.mkdirSync(dir, { recursive: true });
  if (slug === "checkout") {
    // The live site redirects an empty-cart checkout to /cart.
    fs.writeFileSync(
      path.join(dir, "page.tsx"),
      `import { redirect } from "next/navigation";\n\nexport default function Page() {\n  redirect("/cart");\n}\n`,
    );
    continue;
  }
  const rel = "@/content/" + slug;
  const isPost = ["how-to-build-a-smoothie-to-fight-inflammation", "top-tips-for-gut-health-from-nutritionists", "why-do-we-start-with-liver-support-in-our-clinic"].includes(slug);
  const header = isPost ? "SiteHeaderPost" : "SiteHeader";
  const body = `import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ${header} from "@/components/${header}";
import ${name} from "${rel}";

export const metadata: Metadata = { title: ${JSON.stringify(title.replace(/\s+/g, " ").trim() || "SO Clinic")} };

export default function Page() {
  return (
    <PageShell bodyClass=${JSON.stringify(stripBody(bodyClass))} route="/${route}" header={<${header} />}>
      <${name} />
    </PageShell>
  );
}
`;
  fs.writeFileSync(path.join(dir, "page.tsx"), body);
}
console.log("routes:", manifest.map((m) => "/" + routeOf(m.slug)).join(" "));
