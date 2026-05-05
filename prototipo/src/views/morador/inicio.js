import { num, brl, rel } from '../../core/format.js';
import { listar as listarTrans } from '../../services/transacoes.js';
import { ranking, posicaoDe } from '../../services/moradores.js';
import { getState } from '../../core/store.js';

export function renderInicio(root, morador) {
  const s = getState();
  const equiv = morador.pontos * s.configPontos.valorReaisPorPonto;
  const recentes = listarTrans(morador.id).slice(0, 5);
  const top3 = ranking(3);
  const minhaPos = posicaoDe(morador.id);

  const hora = new Date().getHours();
  const cumprimento = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiro = morador.nome.split(' ')[0];

  root.innerHTML = `
    <h2 class="p-greet">${cumprimento}, ${primeiro} 👋</h2>

    <div class="p-balance">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;opacity:.85">Seu saldo</div>
      <div class="pts">${num(morador.pontos)} pts</div>
      <div class="eq">≈ ${brl(equiv)} de desconto disponível</div>
    </div>

    <div class="p-section-title">Atividade recente</div>
    <div class="p-feed">
      ${recentes.length ? recentes.map(t => itemFeed(t, s)).join('') : `<div class="empty"><div class="ico">♻️</div><p>Sem atividade ainda. Use o QR na máquina!</p></div>`}
    </div>

    <div class="p-section-title">Sua posição</div>
    <div class="p-feed">
      ${top3.map((m, i) => `
        <div class="p-feed-item" style="${m.id === morador.id ? 'border-color:var(--c-brand)' : ''}">
          <div class="ico">${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
          <div>
            <div class="ttl">${m.id === morador.id ? `Você (#${minhaPos})` : m.nome.split(' ')[0] + ' ' + m.nome.split(' ').slice(-1)[0][0] + '.'}</div>
            <div class="meta">Apto ${m.apto}</div>
          </div>
          <div class="pts">${num(m.pontos)}</div>
        </div>
      `).join('')}
      ${minhaPos > 3 ? `<div class="p-feed-item" style="border-color:var(--c-brand)"><div class="ico">📍</div><div><div class="ttl">Você</div><div class="meta">Apto ${morador.apto}</div></div><div class="pts">#${minhaPos}</div></div>` : ''}
    </div>
  `;
}

function itemFeed(t, s) {
  if (t.tipo === 'deposito') {
    return `
      <div class="p-feed-item">
        <div class="ico">♻️</div>
        <div>
          <div class="ttl">${t.kg} kg de PET descartados</div>
          <div class="meta">${rel(t.ts)}</div>
        </div>
        <div class="pts">+${t.pontos}</div>
      </div>
    `;
  }
  if (t.tipo === 'resgate') {
    const r = s.recompensas.find(x => x.id === t.recompensaId);
    return `
      <div class="p-feed-item">
        <div class="ico">🎁</div>
        <div>
          <div class="ttl">Resgate: ${r?.titulo || 'Recompensa'}</div>
          <div class="meta">${rel(t.ts)}</div>
        </div>
        <div class="pts neg">${t.pontos}</div>
      </div>
    `;
  }
  return '';
}
