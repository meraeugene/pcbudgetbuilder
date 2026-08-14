import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Buildwise recommendation experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Buildwise/i);
  assert.match(html, /Shops: DynaQuest/);
  assert.match(html, /Updated August 2026/);
  assert.doesNotMatch(html, /Build finder/);
  assert.doesNotMatch(html, /id="budget"/);
  assert.doesNotMatch(html, /Adjust budget/);
  assert.match(html, /Desktop/);
  assert.match(html, /Laptop/);
  assert.match(html, /Open filters/);
  assert.match(html, /Price range/);
  assert.match(html, /Choose one/);
  assert.match(html, /₱250–400K/);
  assert.match(html, /Open DynaQuest store/);
  assert.doesNotMatch(html, /UPDATED LIVE/);
  assert.doesNotMatch(html, /Shortlist updates with every change/);
  assert.doesNotMatch(html, /Refreshed August 2026/);
  assert.doesNotMatch(html, /Indicative cash prices/);
  assert.match(html, /laptop shortlist/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);

  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /detail-sidebar/);
  assert.match(source, /Search .* at/);
  assert.match(source, /label: "CPU"/);
  assert.match(source, /label: "RAM"/);
  assert.match(source, /label: "GPU"/);
  assert.match(source, /NVIDIA GeForce/);
  assert.match(source, /AMD \$\{value\}/);
  assert.match(source, /Intel \$\{value\}/);
  assert.doesNotMatch(source, /const fillers/);
  assert.match(source, /item\.price >= activeRange\.min && item\.price <= activeRange\.max/);
  assert.match(source, /const curated = inRanges/);
  assert.match(source, /\.\.\.curated, \.\.\.supplemental/);
  assert.match(source, /Lenovo LOQ 15/);
  assert.match(source, /filtersOpen/);
  assert.match(source, /detailsOpen/);
  assert.match(source, /panel-scrim/);
  assert.match(source, /PanelRight/);

  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /min-width:801px.*max-width:1100px/s);
  assert.match(css, /min-width:561px.*max-width:800px/s);
  assert.match(css, /max-width:560px/s);
  assert.match(css, /max-height:600px/s);
  assert.match(css, /\.sidebar\.open/);
  assert.match(css, /\.menu-toggle/);
  assert.match(css, /\.detail-toggle/);
  assert.match(css, /--card-shadow/);
  assert.match(css, /perspective:1200px/);
  assert.match(css, /@keyframes card-in/);
  assert.match(css, /rotateX/);
  assert.match(css, /overflow-y:auto/);
  assert.match(css, /-webkit-overflow-scrolling:touch/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.doesNotMatch(css, /article:nth-child\(n\+7\)\s*\{\s*display:none/);
});
