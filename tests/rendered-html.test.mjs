import assert from "node:assert/strict";
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
  assert.doesNotMatch(html, /Build finder/);
  assert.doesNotMatch(html, /id="budget"/);
  assert.doesNotMatch(html, /Adjust budget/);
  assert.match(html, /Desktop/);
  assert.match(html, /Laptop/);
  assert.match(html, /Price ranges/);
  assert.match(html, /Select one or more/);
  assert.match(html, /UPDATED LIVE/);
  assert.match(html, /laptop shortlist/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});
