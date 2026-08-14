import { cp, mkdir, readFile, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");
const astroOwned = new Set(["featured-offers.html"]);

const copyFile = async (name) => {
  if (astroOwned.has(name)) return;
  await cp(join(root, name), join(dist, name), { recursive: true });
};

const copyAsset = async (asset) => {
  await mkdir(dirname(join(dist, asset)), { recursive: true });
  await cp(join(root, asset), join(dist, asset));
};

await mkdir(dist, { recursive: true });

for (const name of ["data", "nginx", "styles.css", "script.js", "api-enhancements.js", "local-trends.js", "review-tools.js", "robots.txt", "sitemap.xml", "404.html", "health.html"]) {
  await copyFile(name);
}

const publicTexts = ["styles.css", ...await readdir(root).then((names) => names.filter((name) => name.endsWith(".html")))];
for (const name of await readdir(join(root, "data"))) {
  if (name.endsWith(".json")) publicTexts.push(join("data", name));
}
for (const name of await readdir(join(root, "src", "pages"))) {
  if (name.endsWith(".astro")) publicTexts.push(join("src", "pages", name));
}
for (const name of await readdir(join(root, "src", "components"))) {
  if (name.endsWith(".astro")) publicTexts.push(join("src", "components", name));
}

const assetRefs = new Set();
for (const name of publicTexts) {
  if (name === "asset-approval.html") continue;
  const text = await readFile(join(root, name), "utf8");
  for (const match of text.matchAll(/assets\/(?:photos|product-offers)\/[^"')\s]+/g)) {
    assetRefs.add(match[0]);
  }
}

for (const asset of assetRefs) {
  await copyAsset(asset);
}

for (const name of await readdir(root)) {
  if (!name.endsWith(".html") || astroOwned.has(name) || name === "asset-approval.html") continue;
  const info = await stat(join(root, name));
  if (info.isFile()) await copyFile(name);
}
