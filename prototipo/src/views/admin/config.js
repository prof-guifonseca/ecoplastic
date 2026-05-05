import { getState, patch, reset } from '../../core/store.js';
import { listar as listarCoops, atual as coopAtual, trocar as trocarCoop } from '../../services/cooperativa.js';
import { openModal, confirm } from '../../components/modal.js';
import { toast } from '../../components/toast.js';
import { go } from '../../core/router.js';
import { brl } from '../../core/format.js';

export function renderConfig(root) {
  const s = getState();
  const coop = coopAtual();

  root.innerHTML = `
    <div class="topbar">
      <div><h1>Configurações</h1><div class="sub">Programa de pontos, cooperativa e conta</div></div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Programa de pontos</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { l: 'Pontos por garrafa', v: s.configPontos.pontosPorGarrafa },
            { l: 'Pontos por kg compactado', v: s.configPontos.pontosPorKg },
            { l: 'Conversão (R$ por ponto)', v: brl(s.configPontos.valorReaisPorPonto) },
            { l: 'Repartição condomínio', v: `${Math.round(s.configPontos.splitCondominio * 100)}%` }
          ].map(r => `
            <div style="display:flex;justify-content:space-between;padding:10px;background:var(--c-bg-2);border:1px solid var(--c-border);border-radius:var(--r-md)">
              <span style="color:var(--c-muted)">${r.l}</span><b>${r.v}</b>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <h3>Cooperativa parceira</h3>
        ${coop ? `
          <div style="padding:14px;background:var(--c-bg-2);border:1px solid var(--c-border);border-radius:var(--r-md);margin-bottom:14px">
            <div style="font-weight:600;font-size:16px">${coop.nome}</div>
            <div style="color:var(--c-muted);font-size:13px">R$ ${coop.precoKg.toFixed(2)}/kg · ${coop.distanciaKm} km</div>
          </div>
        ` : ''}
        <button class="btn" id="trocarCoop">↻ Trocar cooperativa</button>
      </div>

      <div class="card">
        <h3>Máquina compactadora</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--c-muted)">ID</span><b>${s.maquina.id}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--c-muted)">Capacidade</span><b>${s.maquina.capacidadeKg} kg</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--c-muted)">Ocupação atual</span><b>${s.maquina.ocupadoKg.toFixed(1)} kg</b></div>
        </div>
      </div>

      <div class="card">
        <h3>Conta</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn" id="trocarPerfil">👤 Trocar de perfil (logout)</button>
          <button class="btn danger" id="resetDemo">⟳ Resetar dados de demonstração</button>
        </div>
        <p style="color:var(--c-muted);font-size:12px;margin-top:14px">
          O reset apaga todos os dados criados (coletas, convites, depósitos) e volta ao seed inicial.
        </p>
      </div>
    </div>
  `;

  root.querySelector('#trocarCoop').addEventListener('click', () => abrirTrocarCoop());
  root.querySelector('#trocarPerfil').addEventListener('click', () => {
    patch('persona', null);
    patch('currentMoradorId', null);
    go('/login');
  });
  root.querySelector('#resetDemo').addEventListener('click', async () => {
    const ok = await confirm({
      title: 'Resetar demonstração',
      message: 'Todos os dados criados serão substituídos pelo seed. Continuar?',
      confirmLabel: 'Resetar', danger: true
    });
    if (ok) {
      reset();
      toast.success('Dados resetados', 'Voltamos ao estado inicial.');
      go('/admin/dashboard');
    }
  });
}

async function abrirTrocarCoop() {
  const s = getState();
  const lista = listarCoops();
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '8px';
  wrap.innerHTML = lista.map(c => `
    <label style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;padding:12px;background:var(--c-bg-2);border:1px solid ${c.id === s.cooperativa.atualId ? 'var(--c-brand)' : 'var(--c-border)'};border-radius:var(--r-md);cursor:pointer">
      <input type="radio" name="coop" value="${c.id}" ${c.id === s.cooperativa.atualId ? 'checked' : ''}>
      <div>
        <div style="font-weight:600">${c.nome}</div>
        <div style="font-size:12px;color:var(--c-muted)">${c.distanciaKm} km de distância</div>
      </div>
      <div style="text-align:right;color:var(--c-brand);font-weight:600">R$ ${c.precoKg.toFixed(2)}/kg</div>
    </label>
  `).join('');

  const result = await openModal({
    title: 'Trocar cooperativa parceira',
    body: wrap,
    actions: [
      { label: 'Cancelar', value: false },
      { label: 'Confirmar troca', variant: 'primary', onClick: () => {
        const sel = wrap.querySelector('input[name=coop]:checked');
        return sel ? sel.value : false;
      }}
    ]
  });

  if (result && result !== s.cooperativa.atualId) {
    trocarCoop(result);
    const novo = lista.find(c => c.id === result);
    toast.success('Cooperativa atualizada', `Próximas coletas com ${novo.nome}.`);
  }
}
