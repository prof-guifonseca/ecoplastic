import { init, getState } from './core/store.js';
import { start, go } from './core/router.js';
import { runCleanups } from './core/lifecycle.js';
import { renderLogin } from './views/login.js';
import { renderAdminShell } from './views/admin/shell.js';
import { renderMoradorStandalone } from './views/morador/standalone.js';

const app = document.getElementById('app');

function route(r) {
  const s = getState();

  // Tear down any view-scoped subscriptions / timers from the previous shell.
  runCleanups();

  // Auth gate: send to login if no persona, except when explicitly on /login.
  if (r.persona === 'login' || (!s.persona && r.persona !== 'login')) {
    renderLogin(app);
    if (r.persona !== 'login') history.replaceState(null, '', '#/login');
    return;
  }

  if (r.persona === 'admin') {
    if (s.persona !== 'sindico') { go('/morador/inicio'); return; }
    renderAdminShell(app, r.screen || 'dashboard');
    return;
  }

  if (r.persona === 'morador') {
    if (s.persona !== 'morador') { go('/admin/dashboard'); return; }
    renderMoradorStandalone(app);
    return;
  }

  go(s.persona === 'morador' ? '/morador/inicio' : (s.persona === 'sindico' ? '/admin/dashboard' : '/login'));
}

function boot() {
  init();
  const s = getState();
  if (!s.persona && (location.hash === '' || location.hash === '#/')) {
    history.replaceState(null, '', '#/login');
  }
  start(route);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
