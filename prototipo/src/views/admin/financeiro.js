import { getState } from '../../core/store.js';
import { brl, num, dec } from '../../core/format.js';
import { saldoCondominio, acumuladoAno, projecaoAnual, simulate } from '../../services/financeiro.js';
import { toast } from '../../components/toast.js';
import { doughnutSplit } from '../../components/chart.js';

export function renderFinanceiro(root) {
  const s = getState();
  const saldo = saldoCondominio();
  const acum = acumuladoAno();
  const proj = projecaoAnual();
  const splitPct = Math.round(s.configPontos.splitCondominio * 100);

  root.innerHTML = `
    <div class="topbar">
      <div><h1>Financeiro</h1><div class="sub">Receita gerada e simulação</div></div>
      <button class="btn" id="shareLink">📤 Compartilhar resumo</button>
    </div>

    <div class="grid grid-3" style="margin-bottom:16px">
      <div class="card kpi">
        <div class="label">Saldo do condomínio</div>
        <div class="value">${brl(saldo)}</div>
        <div class="delta">aplicável no boleto</div>
      </div>
      <div class="card kpi">
        <div class="label">Acumulado ${new Date().getFullYear()}</div>
        <div class="value">${brl(acum)}</div>
      </div>
      <div class="card kpi">
        <div class="label">Projeção anual</div>
        <div class="value">${brl(proj)}</div>
        <div class="delta">baseado nos últimos 6 meses</div>
      </div>
    </div>

    <div class="grid grid-2" style="margin-bottom:16px">
      <div class="card">
        <h3>Repartição da receita</h3>
        <div class="split-bar"><div class="seg-a"></div><div class="seg-b"></div></div>
        <div class="split-legend">
          <div><span class="dot" style="background:var(--c-brand)"></span><b>${splitPct}%</b> Condomínio</div>
          <div><span class="dot" style="background:var(--c-accent)"></span><b>${100 - splitPct}%</b> EcoTech</div>
        </div>
        <p style="color:var(--c-muted);font-size:13px;margin-top:14px">
          A EcoTech cobre operação da máquina, integração com cooperativa, plataforma e suporte.
        </p>
        <div class="chart-wrap sm" style="margin-top:8px"><canvas id="splitChart"></canvas></div>
      </div>

      <div class="card">
        <h3>Uso do saldo</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { label: 'Crédito no boleto do condomínio', val: brl(saldo * 0.6) },
            { label: 'Pontos para moradores', val: brl(saldo * 0.25) },
            { label: 'Fundo reserva sustentável', val: brl(saldo * 0.10) },
            { label: 'Saldo a aplicar', val: brl(saldo * 0.05) }
          ].map(r => `
            <div style="display:flex;justify-content:space-between;padding:10px;background:var(--c-bg-2);border:1px solid var(--c-border);border-radius:var(--r-md)">
              <span>${r.label}</span>
              <b>${r.val}</b>
            </div>
          `).join('')}
        </div>
        <button class="btn primary" id="aplicar" style="margin-top:14px;width:100%">Aplicar repartição automática</button>
      </div>
    </div>

    <div class="card simulator">
      <h3>Simulador de receita</h3>
      <p style="color:var(--c-muted);margin:6px 0 16px;font-size:13px">Estime a receita anual do seu condomínio.</p>
      <div class="row">
        <div>
          <div class="label">Unidades habitacionais</div>
          <input type="range" id="simU" min="20" max="300" value="84" step="2">
        </div>
        <div class="val" id="simUVal">84</div>
      </div>
      <div class="row">
        <div>
          <div class="label">Engajamento dos moradores</div>
          <input type="range" id="simE" min="20" max="100" value="74" step="1">
        </div>
        <div class="val" id="simEVal">74%</div>
      </div>
      <div class="result">
        <div class="label" style="color:var(--c-muted);font-size:12px">Receita anual estimada</div>
        <div class="big" id="simRes">${brl(simulate(84, 74).receitaAnual)}</div>
        <div style="color:var(--c-muted);font-size:12px;margin-top:4px"><span id="simKg">${dec(simulate(84,74).kgMes)} kg/mês</span> · ${num(84)} unidades</div>
      </div>
    </div>
  `;

  // Donut
  setTimeout(() => {
    const c = root.querySelector('#splitChart');
    if (c && c.isConnected) doughnutSplit(c, s.configPontos.splitCondominio);
  }, 0);

  // Simulator
  const u = root.querySelector('#simU'), e = root.querySelector('#simE');
  const uv = root.querySelector('#simUVal'), ev = root.querySelector('#simEVal');
  const res = root.querySelector('#simRes'), kg = root.querySelector('#simKg');
  function recalc() {
    uv.textContent = u.value; ev.textContent = `${e.value}%`;
    const r = simulate(+u.value, +e.value);
    res.textContent = brl(r.receitaAnual);
    kg.textContent = `${dec(r.kgMes)} kg/mês`;
  }
  u.addEventListener('input', recalc);
  e.addEventListener('input', recalc);

  // Actions
  root.querySelector('#shareLink').addEventListener('click', async () => {
    const txt = `Nosso condomínio gerou ${brl(saldo)} reciclando PET com a EcoTech.`;
    if (navigator.share) {
      try { await navigator.share({ title: 'EcoTech', text: txt }); return; } catch {}
    }
    await navigator.clipboard.writeText(txt);
    toast.success('Link copiado', 'Cole onde quiser compartilhar.');
  });

  root.querySelector('#aplicar').addEventListener('click', () => {
    toast.success('Repartição aplicada', `Crédito agendado para o próximo boleto.`);
  });
}
