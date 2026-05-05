const map = new Map();

export function on(event, handler) {
  if (!map.has(event)) map.set(event, new Set());
  map.get(event).add(handler);
  return () => off(event, handler);
}

export function off(event, handler) {
  map.get(event)?.delete(handler);
}

export function emit(event, payload) {
  map.get(event)?.forEach(h => {
    try { h(payload); } catch (e) { console.error('[bus]', event, e); }
  });
}
