#!/usr/bin/env node
// Driver CDP do app finance (Chrome headless, sem dependências externas).
//
// Uso (fluxo validado na feature account; use SEMPRE http://localhost, nunca 127.0.0.1):
//   node driver.mjs --token "$TOKEN" --url http://localhost:3001/account \
//     --do "click=Nova conta" --do "wait=1200" \
//     --do "fill=account.name.label:Conta Skill" --do "fill=account.type.label:CHECKING" \
//     --do "click=Salvar" --do "wait=2500" \
//     --do "goto=http://localhost:3001/account" --do "wait=2000" \
//     --do "text" --shot /tmp/after.png
//
// click= usa o texto RENDERIZADO (nao a chave i18n); fill= em <select> usa o value da opcao.
//
// Comandos de --do (podem repetir, executados em ordem):
//   text                       imprime o innerText do body (limitado)
//   text=<seletor>             imprime o innerText do elemento
//   click=<texto|css:sel>      clica no 1o elemento cujo texto exato/parcial bate, ou por seletor CSS
//   fill=<label|name>=<valor>  preenche input associado ao label (ou name=) e dispara input/change
//   wait=<ms>                  espera
//   goto=<url>                 navega
//   shot=<path>                screenshot
//   eval=<js>                  avalia expressao no page e imprime JSON
//
// Exit code != 0 se algum comando falhar (falha explícita, não silenciosa).

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? def : argv[i + 1];
};
const dos = argv.reduce((acc, a, i) => {
  if (a === '--do') acc.push(argv[i + 1]);
  return acc;
}, []);

const TOKEN = opt('token', process.env.AUTH_TOKEN ?? '');
const START_URL = opt('url', 'http://localhost:3001/home');
const SHOT = opt('shot', '');
const PORT = Number(opt('port', '9222'));
const WIDTH = Number(opt('width', '1280'));
const HEIGHT = Number(opt('height', '900'));
const COOKIE_NAME = 'auth-token';
const HOST = new URL(START_URL).hostname;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), 'fintech-cdp-'));

const chrome = spawn(
  '/usr/bin/google-chrome',
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);
chrome.stderr.on('data', () => {}); // silencia ruído do chrome

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await res.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('chrome não abriu a porta de debug');
}

const ws = new WebSocket(await wsUrl());
let msgId = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

function send(method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Network.enable', {}, sessionId);
await send(
  'Emulation.setDeviceMetricsOverride',
  { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false },
  sessionId,
);

async function evaluate(expression) {
  const { result, exceptionDetails } = await send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true, userGesture: true },
    sessionId,
  );
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description ?? ''));
  return result.value;
}

async function goto(url) {
  await send('Page.navigate', { url }, sessionId);
  await sleep(1200);
  // espera o app hidratar (o shell renderiza o menu)
  for (let i = 0; i < 40; i++) {
    const ready = await evaluate('document.body.innerText.trim().length > 40');
    if (ready) break;
    await sleep(250);
  }
}

async function screenshot(path) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
  writeFileSync(path, Buffer.from(data, 'base64'));
  console.log(`SHOT ${path}`);
}

// Helpers injetados: clicam/preenchem por texto visível ou seletor CSS.
const CLICK_JS = (target) => `(() => {
  const t = ${JSON.stringify(target)};
  if (t.startsWith('css:')) {
    const el = document.querySelector(t.slice(4));
    if (!el) return { ok: false, why: 'selector not found: ' + t };
    el.scrollIntoView({block:'center'}); el.click(); return { ok: true, how: 'css' };
  }
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const nodes = Array.from(document.querySelectorAll('button,a,[role=button],input[type=submit]'));
  let el = nodes.find((n) => norm(n.innerText || n.value) === t);
  if (!el) el = nodes.find((n) => norm(n.innerText || n.value).includes(t));
  if (!el) return { ok: false, why: 'no clickable with text: ' + t };
  el.scrollIntoView({block:'center'}); el.click();
  return { ok: true, how: 'text', label: norm(el.innerText || el.value) };
})()`;

const FILL_JS = (label, value) => `(() => {
  const label = ${JSON.stringify(label)}, value = ${JSON.stringify(value)};
  // rótulos do app são renderizados em CAIXA ALTA (uppercaseLabel), então compara sem caixa
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const wanted = norm(label);
  const inputs = Array.from(document.querySelectorAll('input,textarea,select'));
  let el = inputs.find((n) => norm(n.getAttribute('aria-label')) === wanted);
  if (!el) el = inputs.find((n) => n.name === label || n.id === label);
  if (!el) {
    for (const lab of Array.from(document.querySelectorAll('label'))) {
      if (norm(lab.innerText).includes(wanted)) {
        const id = lab.getAttribute('for');
        el = (id && document.getElementById(id)) || lab.querySelector('input,textarea,select');
        if (el) break;
      }
    }
  }
  // fallback: a chave i18n termina no nome do campo ('supplier.name.label' -> 'name')
  if (!el) {
    const parts = label.split('.');
    const suffix = parts[parts.length - 1];
    const fieldName = ['label', 'placeholder'].includes(suffix) ? parts[parts.length - 2] : suffix;
    el = inputs.find((n) => n.name === fieldName || n.id === fieldName);
  }
  if (!el) return { ok: false, why: 'no field for: ' + label };
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
    : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.blur();
  return { ok: true, name: el.name || el.id };
})()`;

let failed = 0;
async function run(cmd) {
  const [verb, ...rest] = cmd.split('=');
  const arg = rest.join('=');
  try {
    if (verb === 'goto') { await goto(arg); return; }
    if (verb === 'wait') { await sleep(Number(arg || 1000)); return; }
    if (verb === 'shot') { await screenshot(arg); return; }
    if (verb === 'text') {
      const value = arg
        ? await evaluate(`(document.querySelector(${JSON.stringify(arg)})?.innerText ?? '')`)
        : await evaluate('document.body.innerText');
      console.log('TEXT>>', value.slice(0, 3000));
      return;
    }
    if (verb === 'eval') { console.log('EVAL>>', JSON.stringify(await evaluate(arg))); return; }
    if (verb === 'click') {
      const r = await evaluate(CLICK_JS(arg));
      if (!r.ok) throw new Error(r.why);
      await sleep(600);
      console.log('CLICK', r.label ?? arg);
      return;
    }
    if (verb === 'fill') {
      const idx = arg.indexOf(':');
      if (idx === -1) throw new Error('use fill=<label>=<valor>');
      const label = arg.slice(0, idx);
      const value = arg.slice(idx + 1);
      const r = await evaluate(FILL_JS(label, value));
      if (!r.ok) throw new Error(r.why);
      await sleep(300);
      console.log('FILL', r.name);
      return;
    }
    throw new Error(`comando desconhecido: ${cmd}`);
  } catch (e) {
    failed++;
    console.error(`FAIL [${cmd}] ${e.message}`);
  }
}

try {
  if (TOKEN) {
    const isHttps = START_URL.startsWith('https');
    await send(
      'Network.setCookie',
      { name: COOKIE_NAME, value: TOKEN, domain: HOST, path: '/', httpOnly: true, secure: isHttps },
      sessionId,
    );
  }
  await goto(START_URL);
  for (const cmd of dos) await run(cmd);
  if (SHOT) await screenshot(SHOT);
} finally {
  ws.close();
  chrome.kill('SIGKILL');
}

process.exit(failed === 0 ? 0 : 1);