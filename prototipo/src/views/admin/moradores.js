import { listar, ranking, totalAtivosMes, totalCadastrados, convidar, convitesPendentes } from '../../services/moradores.js';
import { pontosDistribuidosMes } from '../../services/transacoes.js';
import { num, brl, dec, initials } from '../../core/format.js';
import { openModal } from '../../components/modal.js';
import { toast } from '../../components/toast.js';
import { compose, required, email as vEmail, apto as vApto } from '../../core/validate.js';
import { getState } from '../../core/store.js';

export function renderMoradores(root) {
  const moradores = listar();
  const top = ranking(20);
  const ativos = totalAtivosMes();
  const cad = totalCadastrados();
  const pend = convitesPendentes().length;
  const pts = pontosDistribuidosMes();
  const valor = pts * getState().configPontos.valorReaisPorPonto;

  root.innerHTML = `
    <div class="topbar">
      <div><h1>Moradores</h1><div class="sub">Engajamento e ranking</div></div>
      <button class="btn primary" id="convidar">+ Convidar moradores</button>
    </div>

    <div class="grid grid-3" style="margin-bottom:16px">
      <div class="card kpi">
        <div class="label">Cadastrados</div>
        <div class="value">${cad}/${getState().condominio.unidades}</div>
        <div class="delta">${pend} convite${pend !== 1 ? 's' : ''} pendente${pend !== 1 ? 's' : ''}</div>
      </div>
      <div class="card kpi">
        <div class="label">Ativos no mês</div>
        <div class="value">${ativos}</div>
        <div class="delta">${Math.round((ativos / cad) * 100) || 0}% de adesão</div>
      </div>
      <div class="card kpi">
        <div class="label">Pontos distribuídos</div>
        <div class="value">${num(pts)}</div>
        <div class="delta">≈ ${brl(valor)}</div>
      </div>
    </div>

    <div class="card">
      <h3>Ranking — top 20</h3>
      <table class="table">
        <thead><tr><th>#</th><th>Morador</th><th>Apto</th><th>Kg total</th><th>Pontos</th><th>Bônus</th></tr></thead>
        <tbody>
          ${top.map((m, i) => `
            <tr>
              <td><b style="color:var(--c-accent)">${i + 1}º</b></td>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar">${initials(m.nome)}</div><div><div><b>${m.nome}</b></div><div style="font-size:11px;color:var(--c-muted)">${m.email}</div></div></div></td>
              <td>${m.apto}</td>
              <td>${dec(m.kgTotal)}</td>
              <td><b style="color:var(--c-brand)">${num(m.pontos)}</b></td>
              <td>${i === 0 ? '<span class="tag ok">−R$ 50 boleto</span>' : i === 1 ? '<span class="tag ok">−R$ 25</span>' : i === 2 ? '<span class="tag ok">−R$ 10</span>' : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  root.querySelector('#convidar').addEventListener('click', () => abrirConvidar());
}

async function abrirConvidar() {
  const wrap = document.createElement('div');
  wrap.className = 'form';
  wrap.innerHTML = `
    <p style="color:var(--c-muted);margin:0 0 4px">Adicione e-mails e apartamentos. Os moradores receberão um link de cadastro (simulado).</p>
    <div id="rows"></div>
    <button type="button" class="btn ghost sm" id="addRow">+ Adicionar linha</button>
  `;
  const rows = wrap.querySelector('#rows');

  function addRow() {
    const r = document.createElement('div');
    r.className = 'repeater-row';
    r.innerHTML = `
      <div class="field"><label>E-mail</label><input type="email" name="email" placeholder="morador@email.com"><div class="err"></div></div>
      <div class="field"><label>Apto</label><input name="apto" placeholder="1204"><div class="err"></div></div>
      <button class="btn ghost sm" type="button" title="Remover">✕</button>
    `;
    r.querySelector('button').addEventListener('click', () => r.remove());
    rows.appendChild(r);
  }
  addRow(); addRow();
  wrap.querySelector('#addRow').addEventListener('click', addRow);

  const result = await openModal({
    title: 'Convidar moradores',
    body: wrap,
    actions: [
      { label: 'Cancelar', value: false },
      { label: 'Enviar convites', variant: 'primary', onClick: () => {
        const out = [];
        let ok = true;
        rows.querySelectorAll('.repeater-row').forEach(r => {
          const em = r.querySelector('[name=email]').value.trim();
          const ap = r.querySelector('[name=apto]').value.trim();
          const errs = r.querySelectorAll('.err');
          errs.forEach(e => e.textContent = '');
          const eErr = compose(required, vEmail)(em);
          const aErr = compose(required, vApto)(ap);
          if (eErr) { errs[0].textContent = eErr; ok = false; }
          if (aErr) { errs[1].textContent = aErr; ok = false; }
          if (!eErr && !aErr) out.push({ email: em, apto: ap });
        });
        if (!ok || !out.length) return false;
        return out;
      }}
    ]
  });

  if (result) {
    convidar(result);
    toast.success(`${result.length} convite${result.length > 1 ? 's' : ''} enviado${result.length > 1 ? 's' : ''}`, 'Os moradores receberão por e-mail.');
  }
}
