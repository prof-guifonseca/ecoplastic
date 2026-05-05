import { listar as listarTrans } from '../../services/transacoes.js';
import { dt, time } from '../../core/format.js';
import { getState } from '../../core/store.js';

export function renderHistorico(root, morador) {
  const s = getState();
  const trans = listarTrans(morador.id);

  // Group by day
  const groups = new Map();
  trans.forEach(t => {
    const k = new Date(t.ts).toDateString();
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(t);
  });

  root.innerHTML = `
    <h2 class="p-greet">Histórico</h2>
    ${trans.length === 0 ? `
      <div class="empty"><div class="ico">📭</div><p>Sem atividade ainda. Comece descartando uma garrafa!</p></div>
    ` : Array.from(groups.entries()).map(([day, items]) => `
      <div class="p-section-title">${dt(new Date(day))}</div>
      <div class="p-feed">
        ${items.map(t => {
          if (t.tipo === 'deposito') return `
            <div class="p-feed-item">
              <div class="ico">♻️</div>
              <div>
                <div class="ttl">${t.kg} kg PET</div>
                <div class="meta">${time(t.ts)}</div>
              </div>
              <div class="pts">+${t.pontos}</div>
            </div>`;
          const r = s.recompensas.find(x => x.id === t.recompensaId);
          return `
            <div class="p-feed-item">
              <div class="ico">🎁</div>
              <div>
                <div class="ttl">${r?.titulo || 'Resgate'}</div>
                <div class="meta">${time(t.ts)}</div>
              </div>
              <div class="pts neg">${t.pontos}</div>
            </div>`;
        }).join('')}
      </div>
    `).join('')}
  `;
}
