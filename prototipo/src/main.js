import { init, getState, patch } from './core/store.js';
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

  // Quick-entry deep links: /prototipo/?p=sindico  or  /prototipo/?p=morador
  // Skip the login screen and route directly into the persona's default view.
  const params = new URLSearchParams(location.search);
  const quick = params.get('p');
  if (quick === 'sindico' || quick === 'morador') {
    patch('persona', quick);
    if (quick === 'morador') {
      const st = getState();
      const julia = st.moradores.find(m => m.nome.startsWith('Julia')) || st.moradores[0];
      patch('currentMoradorId', julia.id);
    }
    const target = quick === 'sindico' ? '#/admin/dashboard' : '#/morador/inicio';
    history.replaceState(null, '', location.pathname + target);
  }

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
