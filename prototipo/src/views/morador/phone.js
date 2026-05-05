import { getState } from '../../core/store.js';
import { go, current } from '../../core/router.js';
import { renderInicio } from './inicio.js';
import { renderHistorico } from './historico.js';
import { renderTrocar } from './trocar.js';
import { renderQr, stopQrTimer } from './qr.js';
import { on } from '../../core/bus.js';
import { registerCleanup } from '../../core/lifecycle.js';

const TABS = [
  { id: 'inicio',    label: 'Início',    ico: '🏠', fn: renderInicio },
  { id: 'historico', label: 'Histórico', ico: '📜', fn: renderHistorico },
  { id: 'trocar',    label: 'Trocar',    ico: '🎁', fn: renderTrocar },
  { id: 'qr',        label: 'QR',        ico: '📷', fn: renderQr }
];

export function renderPhone(root, opts = {}) {
  const { moradorId, embedded = false, screen } = opts;
  const s = getState();
  const mid = moradorId || s.currentMoradorId || s.moradores[0].id;
  const m = s.moradores.find(x => x.id === mid) || s.moradores[0];

  // Tab resolution: explicit > preserved data-tab on root > router (non-embedded) > default
  const preserved = root.dataset.tab;
  const activeTab =
    screen ||
    preserved ||
    (embedded ? 'inicio' : (current().screen || 'inicio'));

  // Stop QR timer if leaving QR tab (or re-entering — we'll restart inside renderQr)
  if (preserved === 'qr' && activeTab !== 'qr') stopQrTimer();

  root.dataset.tab = activeTab;
  root.innerHTML = `
    <div class="notch"></div>
    <div class="phone-screen" id="pscreen"></div>
    <div class="phone-tabs">
      ${TABS.map(t => `
        <button class="${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">
          <span class="ico">${t.ico}</span><span>${t.label}</span>
        </button>
      `).join('')}
    </div>
  `;

  const screenEl = root.querySelector('#pscreen');
  const renderFn = TABS.find(t => t.id === activeTab)?.fn || renderInicio;
  renderFn(screenEl, m);

  // Tab clicks
  root.querySelectorAll('.phone-tabs button').forEach(b => {
    b.addEventListener('click', () => {
      const tab = b.dataset.tab;
      if (embedded) {
        renderPhone(root, { moradorId: m.id, embedded: true, screen: tab });
      } else {
        go(`/morador/${tab}`);
      }
    });
  });

  // Refresh-on-state for the active screen.
  // Self-unsubscribe when this screen instance is replaced (screenEl detached).
  const off = on('state:changed', () => {
    if (!screenEl.isConnected) { off(); return; }
    const tab = root.dataset.tab || 'inicio';
    const fn = TABS.find(t => t.id === tab)?.fn || renderInicio;
    const cur = getState();
    const refreshed =
      cur.moradores.find(x => x.id === (embedded ? mid : (cur.currentMoradorId || mid))) || m;
    fn(screenEl, refreshed);
  });
  registerCleanup(() => { off(); stopQrTimer(); });
}
