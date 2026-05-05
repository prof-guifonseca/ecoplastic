// Tracks "active view" cleanup callbacks. Each view can register a cleanup,
// and when the active view is replaced, previous cleanups run.
const stack = [];

export function registerCleanup(fn) {
  stack.push(fn);
}

export function runCleanups() {
  while (stack.length) {
    const fn = stack.pop();
    try { fn(); } catch (e) { console.warn('[lifecycle] cleanup error', e); }
  }
}
