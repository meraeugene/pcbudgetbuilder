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
});
