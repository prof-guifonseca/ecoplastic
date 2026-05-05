import { getState, patch } from '../../core/store.js';
import { go, current } from '../../core/router.js';
import { renderPhone } from './phone.js';
import { on } from '../../core/bus.js';
import { registerCleanup } from '../../core/lifecycle.js';
import { num, brl } from '../../core/format.js';

export function renderMoradorStandalone(root) {
  const s = getState();
  const m = s.moradores.find(x => x.id === s.currentMoradorId) || s.moradores[0];
  const tab = current().screen || 'inicio';

  root.innerHTML = `
    <div style="min-height:100vh;display:grid;grid-template-columns:280px 1fr;background:var(--c-bg-0)">
      <aside class="sidebar" style="margin:16px 0 16px 16px;height:calc(100vh - 32px)">
        <div class="sb-brand">
          <div class="logo">♻️</div>
          <div><h2>EcoPlastic</h2><small>App do morador</small></div>
        </div>
        <div class="sb-condo" id="sbMorador">
          <div class="name">${m.nome}</div>
          <div class="meta">Apto ${m.apto} · <span id="sbPts">${num(m.pontos)}</span> pts (<span id="sbEq">${brl(m.pontos * s.configPontos.valorReaisPorPonto)}</span>)</div>
        </div>
        <p style="color:var(--c-muted);font-size:12px;padding:0 6px">Use as abas no celular. O síndico vê todos os depósitos em tempo real.</p>
        <div class="sb-foot">
          <div class="persona-toggle">
            <button data-persona="sindico">Síndico</button>
            <button class="active" data-persona="morador">Morador</button>
          </div>
          <button class="btn ghost sm" id="logout">Trocar de perfil</button>
        </div>
      </aside>
      <div style="display:grid;place-items:center;padding:24px">
        <div class="phone" id="phone"></div>
      </div>
    </div>
  `;

  const phoneRoot = root.querySelector('#phone');
  renderPhone(phoneRoot, { moradorId: m.id, embedded: false, screen: tab });

  root.querySelectorAll('.persona-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.persona === 'sindico') {
        patch('persona', 'sindico');
        go('/admin/dashboard');
      }
    });
  });
  root.querySelector('#logout').addEventListener('click', () => {
    patch('persona', null);
    patch('currentMoradorId', null);
    go('/login');
  });

  const off = on('state:changed', () => {
    if (!root.isConnected) { off(); return; }
    const cur = getState();
    const refreshed = cur.moradores.find(x => x.id === cur.currentMoradorId) || m;
    const ptsEl = root.querySelector('#sbPts');
    const eqEl = root.querySelector('#sbEq');
    if (ptsEl) ptsEl.textContent = num(refreshed.pontos);
    if (eqEl) eqEl.textContent = brl(refreshed.pontos * cur.configPontos.valorReaisPorPonto);
  });
  registerCleanup(off);
}
