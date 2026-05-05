import { getState } from '../../core/store.js';
import { num } from '../../core/format.js';
import { resgateRecompensa } from '../../services/transacoes.js';
import { confirm } from '../../components/modal.js';
import { toast } from '../../components/toast.js';

export function renderTrocar(root, morador) {
  const s = getState();

  root.innerHTML = `
    <h2 class="p-greet">Trocar pontos</h2>
    <div class="p-balance" style="margin-bottom:12px">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;opacity:.85">Saldo</div>
      <div class="pts">${num(morador.pontos)} pts</div>
    </div>
    <div class="p-rewards">
      ${s.recompensas.map(r => {
        const podeResgatar = morador.pontos >= r.custoPontos && r.estoque > 0;
        return `
          <div class="p-reward">
            <div class="ico">${r.ico}</div>
            <div class="ttl">${r.titulo}</div>
            <div class="desc">${r.descricao}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
              <div class="cost">${num(r.custoPontos)} pts</div>
              <button class="btn sm ${podeResgatar ? 'primary' : ''}" data-resg="${r.id}" ${podeResgatar ? '' : 'disabled'} title="${r.estoque <= 0 ? 'Sem estoque' : (morador.pontos < r.custoPontos ? `Faltam ${r.custoPontos - morador.pontos} pts` : '')}">
                ${r.estoque <= 0 ? 'Esgotado' : 'Trocar'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  root.querySelectorAll('[data-resg]').forEach(b => {
    b.addEventListener('click', async () => {
      const r = s.recompensas.find(x => x.id === b.dataset.resg);
      const ok = await confirm({
        title: 'Confirmar resgate',
        message: `Resgatar "${r.titulo}" por ${num(r.custoPontos)} pts? Você ficará com ${num(morador.pontos - r.custoPontos)} pts.`,
        confirmLabel: 'Resgatar'
      });
      if (!ok) return;
      try {
        resgateRecompensa({ moradorId: morador.id, recompensaId: r.id });
        toast.success('Resgatado!', `Confira no histórico. Recompensa: ${r.titulo}`);
      } catch (e) {
        toast.error('Falha no resgate', e.message);
      }
    });
  });
}
