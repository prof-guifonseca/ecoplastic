import { getState } from '../../core/store.js';
import { brl, dec, num, initials, dt, pct } from '../../core/format.js';
import { totalKgMes, receitaMes, totaisMensais, proximaAgendada } from '../../services/coletas.js';
import { variacaoMes } from '../../services/financeiro.js';
import { ranking, totalAtivosMes, totalCadastrados } from '../../services/moradores.js';
import { metricas } from '../../services/esg.js';
import { lineRevenue } from '../../components/chart.js';

export function renderDashboard(root) {
  const s = getState();
  const kg = totalKgMes(0);
  const kgAnt = totalKgMes(1) || 1;
  const kgVar = ((kg - kgAnt) / kgAnt) * 100;
  const rec = receitaMes(0);
  const recVar = variacaoMes();
  const ativos = totalAtivosMes();
  const cad = totalCadastrados();
  const m = metricas();
  const ocupPct = Math.round((s.maquina.ocupadoKg / s.maquina.capacidadeKg) * 100);
  const top = ranking(3);
  const prox = proximaAgendada();

  root.innerHTML = `
    <div class="topbar">
      <div>
        <h1>Dashboard</h1>
        <div class="sub">${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
      </div>
    </div>

    <div class="hero">
      <div>
        <h2>Em ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}, o lixo do prédio gerou ${brl(rec * s.configPontos.splitCondominio)} em receita.</h2>
        <p>${dec(kg)} kg de PET reciclados · ${num(m.garrafas)} garrafas · CO₂ evitado: ${m.co2Toneladas} t</p>
      </div>
      <div class="pill" style="${recVar.pct < 0 ? 'background:rgba(255,107,107,.12);color:#ffb3b3;border-color:rgba(255,107,107,.3)' : ''}">${recVar.pct >= 0 ? '▲' : '▼'} ${pct(Math.abs(recVar.pct), 100)} vs mês anterior</div>
    </div>

    <div class="grid grid-4" style="margin-bottom:16px">
      <div class="card kpi">
        <div class="label">Reciclado</div>
        <div class="value">${dec(kg)} kg</div>
        <div class="delta ${kgVar < 0 ? 'neg' : ''}">${kgVar >= 0 ? '▲' : '▼'} ${pct(Math.abs(kgVar), 100)} vs mês ant.</div>
      </div>
      <div class="card kpi">
        <div class="label">Receita do condomínio</div>
        <div class="value">${brl(rec * s.configPontos.splitCondominio)}</div>
        <div class="delta ${recVar.abs < 0 ? 'neg' : ''}">${recVar.abs >= 0 ? '▲' : '▼'} ${brl(Math.abs(recVar.abs * s.configPontos.splitCondominio))}</div>
      </div>
      <div class="card kpi">
        <div class="label">Moradores ativos</div>
        <div class="value">${ativos}/${cad}</div>
        <div class="delta">${pct(ativos, cad || 1)} de adesão</div>
      </div>
      <div class="card kpi">
        <div class="label">CO₂ evitado</div>
        <div class="value">${m.co2Toneladas} t</div>
        <div class="delta">acumulado</div>
      </div>
    </div>

    <div class="grid grid-2" style="margin-bottom:16px">
      <div class="card">
        <h3>Evolução · últimos 6 meses</h3>
        <div class="chart-wrap"><canvas id="dashChart"></canvas></div>
      </div>
      <div class="card">
        <h3>Antes × Depois</h3>
        <div class="before-after">
          <div class="col before">
            <h4>Antes</h4>
            <div class="num">−${brl(320)}</div>
            <small style="color:var(--c-muted)">despesa mensal com remoção</small>
          </div>
          <div class="arrow">→</div>
          <div class="col after">
            <h4>Agora</h4>
            <div class="num">+${brl(rec * s.configPontos.splitCondominio)}</div>
            <small style="color:var(--c-muted)">receita líquida do condomínio</small>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-3">
      <div class="card">
        <h3>Capacidade da máquina</h3>
        <div class="big">${ocupPct}%</div>
        <div class="bar ${ocupPct > 80 ? 'warn' : ''}" style="margin-top:10px"><div class="fill" style="width:${ocupPct}%"></div></div>
        <p style="color:var(--c-muted);font-size:12px;margin:10px 0 0">${dec(s.maquina.ocupadoKg)} de ${s.maquina.capacidadeKg} kg · próxima coleta ${prox ? dt(prox.data) : 'a definir'}</p>
      </div>
      <div class="card">
        <h3>Top 3 moradores</h3>
        <div class="ranking-list">
          ${top.map((m, i) => `
            <div class="ranking-row">
              <div class="pos">${i + 1}º</div>
              <div class="avatar">${initials(m.nome)}</div>
              <div class="who">
                <div class="name">${m.nome}</div>
                <div class="meta">Apto ${m.apto} · ${dec(m.kgTotal)} kg</div>
              </div>
              <div class="pts">${num(m.pontos)} pts</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Próxima ação</h3>
        <p style="margin:8px 0;color:var(--c-muted)">Compartilhe o relatório ESG do mês com os moradores. Empreendimentos que publicam ESG mensal valorizam 4–8% no mercado.</p>
        <a class="btn primary" href="#/admin/esg">Abrir relatório</a>
      </div>
    </div>
  `;

  // Render chart after layout (defer one task so the canvas has measured size)
  setTimeout(() => {
    const c = root.querySelector('#dashChart');
    if (c && c.isConnected) lineRevenue(c, totaisMensais());
  }, 0);
}
