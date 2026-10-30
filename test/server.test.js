const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) =>
      server.close(error => error ? reject(error) : resolve())
    );
  }
});

test("health endpoint returns a healthy service response", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "Krishi Nexus");
});

test("home page serves the application HTML", async () => {
  const response = await fetch(`${baseUrl}/`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /KRISHI NEXUS|Krishi Nexus/i);
  assert.match(html, /script\.js/);
});

test("unknown routes return a JSON 404", async () => {
  const response = await fetch(`${baseUrl}/not-a-real-route`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.success, false);
});
