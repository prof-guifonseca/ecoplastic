import { emit } from './bus.js';

let handler = null;

export function start(onRoute) {
  handler = onRoute;
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

export function go(path) {
  if (location.hash !== `#${path}`) location.hash = path;
  else dispatch();
}

export function current() {
  const hash = location.hash.replace(/^#/, '') || '/login';
  const parts = hash.split('/').filter(Boolean);
  return { hash, parts, persona: parts[0] || null, screen: parts[1] || null };
}

function dispatch() {
  const r = current();
  emit('route:changed', r);
  handler?.(r);
}
