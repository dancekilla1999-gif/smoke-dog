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
test('iiko terminal groups accept GUIDs without RFC version and variant bits', () => {
  const configWithGroup = config.inspectConfiguration({ IIKO_TERMINAL_GROUP_ID: '12345678-1234-e123-0123-123456789abc' });
  assert.ok(!configWithGroup.missing.includes('IIKO_TERMINAL_GROUP_ID'));
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
const env = {
  IIKO_APP_ID: 'app', IIKO_CLIENT_SECRET: 'secret', IIKO_API_KEY: 'key',
  IIKO_ORGANIZATION_ID: '22345678-1234-4123-8123-123456789abc',
  IIKO_TERMINAL_GROUP_ID: '32345678-1234-4123-8123-123456789abc',
  IIKO_EXTERNAL_MENU_ID: '42', IIKO_ORDERING_ENABLED: 'true',
  IIKO_TABLE_BINDINGS_JSON: JSON.stringify([row]),
  IIKO_ORDER_ITEMS_JSON: JSON.stringify({ 'dish-001': 'SKU-1' }),
};
const requestId = '42345678-1234-4123-8123-123456789abc';
const productId = '52345678-1234-4123-8123-123456789abc';
const origin = 'https://sd.msk.ru';
const payload = { table: token, requestId, items: [{ id: 'dish-001', quantity: 1, unitPrice: 490 }] };

function orderFixture(values = env) {
  const created = [];
  let confirmed;
  const iiko = {
    read: async (path) => {
      if (path === '/api/1/order/by_id') return { orders: confirmed ? [confirmed] : [] };
      if (path === '/api/1/stop_lists') return { terminalGroupStopLists: [] };
      if (path === '/api/menu/v3/by_id') return {
        id: '42',
        products: [{ sku: 'SKU-1', id: productId, orderItemType: 'Product', type: 'DISH' }],
        itemsGroups: [{ items: [{ productId, sizePrices: [{ price: 490 }] }] }],
      };
      throw new Error(path);
    },
    createTableOrder: async body => {
      created.push(body);
      const info = { id: body.order.id, organizationId: env.IIKO_ORGANIZATION_ID };
      confirmed = { ...info, creationStatus: 'Success', order: { tableIds: [row.tableId], number: 7 } };
      return { orderInfo: { ...info, creationStatus: 'InProgress' } };
    },
  };
  const client = { createIikoClient: async () => iiko, IikoError: class extends Error {} };
  const runtime = { process: { env: values }, console };
  const orders = load('src/lib/iiko/orders.ts', { './config': config, './client': client }, runtime);
  const mocks = {
    '@/lib/iiko/http': { json: (body, status = 200) => ({ body, status }) },
    '@/lib/iiko/client': client,
    '@/lib/iiko/orders': orders,
    '@/lib/iiko/config': { publicConfiguration: t => config.publicConfiguration(t, values) },
  };
  return {
    created,
    route: load('src/app/api/qr-menu/orders/route.ts', mocks, runtime),
    settings: load('src/app/api/qr-menu/config/route.ts', mocks, runtime),
  };
}

function post(body, from = origin) {
  return { nextUrl: new URL(origin), headers: new Headers({ origin: from, 'content-type': 'application/json' }), text: async () => JSON.stringify(body) };
}

function lookup(orderId) {
  const url = new URL(origin);
  url.searchParams.set('table', token);
  if (orderId) url.searchParams.set('requestId', orderId);
  return { nextUrl: url };
}

test('disabled orders refuse even without request body', async () => {
  const { route, created } = orderFixture({});
  const result = await route.POST();
  assert.equal(result.status, 503);
  assert.equal(result.body.accepted, false);
  assert.equal(created.length, 0);
});

test('table QR exposes eligible items and confirms one order on its original table', async () => {
  const { route, settings, created } = orderFixture();
  const config = await settings.GET(lookup());
  assert.equal(config.body.orderingAvailable, true);
  assert.equal(config.body.items[0].price, 490);
  assert.ok(!JSON.stringify(config.body).includes(productId));
  assert.equal((await route.POST(post(payload))).status, 202);
  const status = await route.GET(lookup(requestId));
  assert.equal(status.body.accepted, true);
  assert.equal(status.body.orderNumber, 7);
  assert.equal((await route.POST(post(payload))).body.accepted, true);
  assert.equal(created.length, 1);
  assert.equal(created[0].order.tableIds[0], row.tableId);
  assert.equal(created[0].order.orderServiceType, 'Common');
  assert.equal(created[0].order.items[0].productId, productId);
});

test('rejects unknown tables, cross-origin submissions and changed prices before writing', async () => {
  const { route, created } = orderFixture();
  assert.equal((await route.POST(post({ ...payload, table: 'b'.repeat(43) }))).status, 400);
  assert.equal((await route.POST(post(payload, 'https://example.com'))).status, 403);
  assert.equal((await route.POST(post({ ...payload, items: [{ ...payload.items[0], unitPrice: 1 }] }))).status, 409);
  assert.equal(created.length, 0);
});
