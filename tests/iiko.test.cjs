const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');

function load(relative, mocks = {}, extra = {}) {
  const file = path.join(__dirname, '..', relative);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => name === 'server-only' ? {} : (mocks[name] || require(name)), process: { env: {} }, Buffer, URL, AbortController, setTimeout, clearTimeout, ...extra }, { filename: file });
  return exports;
}
const config = load('src/lib/iiko/config.ts');
const token = 'a'.repeat(43);
const row = { tokenHash: crypto.createHash('sha256').update(token).digest('hex'), label: 'Стол 5', tableId: '12345678-1234-4123-8123-123456789abc' };

test('invalid or duplicate table mappings fail closed', () => {
  assert.equal(config.parseTableBindings('broken').length, 0);
  assert.equal(config.parseTableBindings(JSON.stringify([row, row])).length, 0);
  assert.equal(config.parseTableBindings(JSON.stringify([{ ...row, tableId: '5' }])).length, 0);
  assert.equal(config.resolveTable('5', [row]), undefined);
  assert.equal(config.resolveTable('b'.repeat(43), [row]), undefined);
});
test('public config is never ready and exposes neither IDs nor token hashes', () => {
  const result = config.publicConfiguration(token, { IIKO_TABLE_BINDINGS_JSON: JSON.stringify([row]), IIKO_API_KEY: 'secret' });
  assert.equal(result.ready, false);
  assert.equal(result.orderingAvailable, false);
  assert.equal(result.table.label, 'Стол 5');
  assert.ok(!JSON.stringify(result).includes(row.tableId));
  assert.ok(!JSON.stringify(result).includes(row.tokenHash));
  assert.ok(!JSON.stringify(result).includes('secret'));
});
test('adapter refuses to connect without credentials', async () => {
  let calls = 0;
  const client = load('src/lib/iiko/client.ts', {}, { fetch: async () => { calls++; } });
  await assert.rejects(client.createIikoReader(), e => e.code === 'not_configured');
  assert.equal(calls, 0);
});
test('adapter permits only read paths and does not expose provider error bodies', async () => {
  const calls = [];
  const client = load('src/lib/iiko/client.ts', {}, {
    process: { env: { IIKO_APP_ID: 'app', IIKO_CLIENT_SECRET: 'secret', IIKO_API_KEY: 'key' } },
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith('/api/v2/access_token')) return { ok: true, json: async () => ({ token: 'private-token' }) };
      return { ok: false, status: 401, json: async () => ({ secret: 'never return this' }) };
    },
  });
  const reader = await client.createIikoReader();
  await assert.rejects(reader('/api/1/order/create', {}), e => e.code === 'invalid_response');
  assert.equal(calls.length, 1);
  await assert.rejects(reader('/api/1/organizations', {}), e => e.code === 'upstream_error' && e.upstreamStatus === 401 && !e.message.includes('never'));
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.headers.Authorization, 'Bearer private-token');
  assert.equal(calls[1].options.redirect, 'error');
});
test('orders always refuse even without request body', async () => {
  const route = load('src/app/api/qr-menu/orders/route.ts', { '@/lib/iiko/http': { json: (body, status) => ({ body, status }) } });
  const result = await route.POST();
  assert.equal(result.status, 503);
  assert.equal(result.body.accepted, false);
});
