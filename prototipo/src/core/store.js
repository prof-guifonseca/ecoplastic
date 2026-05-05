import { emit } from './bus.js';
import { buildSeed, SCHEMA_VERSION } from '../data/seed.js';

const KEY = 'eco:v1';
let state = null;
let saveTimer = null;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION) return null;
    return parsed;
  } catch (e) {
    console.warn('[store] failed to parse, reseeding', e);
    return null;
  }
}

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.error('[store] persist failed', e); }
  }, 80);
}

export function init() {
  state = load() || buildSeed();
  if (!load()) localStorage.setItem(KEY, JSON.stringify(state));
  window.addEventListener('storage', (e) => {
    if (e.key === KEY && e.newValue) {
      try {
        state = JSON.parse(e.newValue);
        emit('state:changed', { path: '*', external: true });
      } catch {}
    }
  });
  return state;
}

export function getState() { return state; }

export function patch(path, value) {
  const keys = path.split('.');
  let cur = state;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in cur)) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  persist();
  emit('state:changed', { path });
}

export function update(mutator) {
  mutator(state);
  persist();
  emit('state:changed', { path: '*' });
}

export function reset() {
  state = buildSeed();
  localStorage.setItem(KEY, JSON.stringify(state));
  emit('state:changed', { path: '*', reset: true });
}

export function exportJson() {
  return JSON.stringify(state, null, 2);
}
