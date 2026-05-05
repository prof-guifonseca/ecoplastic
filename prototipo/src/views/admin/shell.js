import { getState, patch } from '../../core/store.js';
import { go } from '../../core/router.js';
import { renderDashboard } from './dashboard.js';
import { renderColetas } from './coletas.js';
import { renderFinanceiro } from './financeiro.js';
import { renderMoradores } from './moradores.js';
import { renderEsg } from './esg.js';
import { renderConfig } from './config.js';
import { renderPhone } from '../morador/phone.js';
import { on } from '../../core/bus.js';
import { registerCleanup } from '../../core/lifecycle.js';

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',     ico: '📊' },
  { id: 'coletas',    label: 'Coletas',       ico: '🚛' },
  { id: 'financeiro', label: 'Financeiro',    ico: '💰' },
  { id: 'moradores',  label: 'Moradores',     ico: '👥' },
  { id: 'esg',        label: 'Relatório ESG', ico: '🌱' },
  { id: 'config',     label: 'Configurações', ico: '⚙️' }
];

const SCREENS = {
  dashboard: renderDashboard,
  coletas: renderColetas,
  financeiro: renderFinanceiro,
  moradores: renderMoradores,
  esg: renderEsg,
  config: renderConfig
};

export function renderAdminShell(root, screenId = 'dashboard') {
  const s = getState();
  root.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="sb-brand">
          <div class="logo">♻️</div>
          <div>
            <h2>EcoTech</h2>
            <small>Painel do síndico</small>
          </div>
        </div>
        <div class="sb-condo">
          <div class="name">${s.condominio.nome}</div>
          <div class="meta">${s.condominio.unidades} unidades · São Paulo/SP</div>
        </div>
        <nav class="sb-nav">
          ${NAV.map(n => `
            <button class="item ${n.id === screenId ? 'active' : ''}" data-screen="${n.id}">
              <span class="ico">${n.ico}</span><span>${n.label}</span>
            </button>
          `).join('')}
        </nav>
        <div class="sb-foot">
          <div class="persona-toggle">
            <button class="active" data-persona="sindico">Síndico</button>
            <button data-persona="morador">Morador</button>
          </div>
        </div>
      </aside>
      <main class="main" id="main"></main>
      <div class="phone-wrap">
        <div class="phone" id="phone"></div>
        <div class="phone-label">App do morador — preview ao vivo (Julia)</div>
      </div>
    </div>
  `;

  const main = root.querySelector('#main');
  const renderFn = SCREENS[screenId] || renderDashboard;
  renderFn(main);

  // Phone preview always shows Julia (a known engaged resident) for the demo
  const phoneRoot = root.querySelector('#phone');
  const julia = s.moradores.find(m => m.nome.startsWith('Julia')) || s.moradores[0];
  renderPhone(phoneRoot, { moradorId: julia.id, embedded: true });

  // Sidebar nav
  root.querySelectorAll('.sb-nav .item').forEach(b => {
    b.addEventListener('click', () => go(`/admin/${b.dataset.screen}`));
  });

  // Persona toggle (only Morador action does something here)
  root.querySelectorAll('.persona-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      const p = b.dataset.persona;
      if (p === 'sindico') return; // already active
      patch('persona', 'morador');
      patch('currentMoradorId', julia.id);
      go('/morador/inicio');
    });
  });

  // Refresh main + phone preview on any state change.
  // Phone tab is preserved via root.dataset.tab inside renderPhone.
  const off = on('state:changed', () => {
    if (!main.isConnected) { off(); return; }
    renderFn(main);
    renderPhone(phoneRoot, { moradorId: julia.id, embedded: true });
  });
  registerCleanup(off);
}
