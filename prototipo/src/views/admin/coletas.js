import { listarColetas, solicitarAvulsa, reagendar, cancelar, proximaAgendada } from '../../services/coletas.js';
import { atual as coopAtual, listar as listarCoops } from '../../services/cooperativa.js';
import { brl, dec, dt } from '../../core/format.js';
import { openModal, confirm } from '../../components/modal.js';
import { buildForm } from '../../components/form.js';
import { required } from '../../core/validate.js';
import { toast } from '../../components/toast.js';

const STATUS_TAG = {
  concluida: 'ok', agendada: 'info', pendente: 'warn', cancelada: 'bad'
};
const STATUS_LABEL = {
  concluida: 'Pago', agendada: 'Agendada', pendente: 'Pendente', cancelada: 'Cancelada'
};

export function renderColetas(root) {
  const lista = listarColetas();
  const prox = proximaAgendada();
  const coop = coopAtual();

  root.innerHTML = `
    <div class="topbar">
      <div>
        <h1>Coletas</h1>
        <div class="sub">Logística com a cooperativa parceira</div>
      </div>
      <button class="btn primary" id="solicitar">+ Solicitar coleta avulsa</button>
    </div>

    <div class="banner" style="margin-bottom:16px">
      <div class="ico">🚛</div>
      <div class="body">
        <b>Estratégia de coleta:</b> agrupamos as coletas com outros condomínios da região para reduzir custo logístico. A cooperativa atual é <b>${coop?.nome || '—'}</b> (R$ ${coop?.precoKg.toFixed(2)}/kg, ${coop?.distanciaKm} km).
      </div>
    </div>

    ${prox ? `
    <div class="card next-pickup" style="margin-bottom:16px">
      <div>
        <div class="when">📅 ${dt(prox.data)} · 14h</div>
        <div class="meta">Próxima coleta agendada com ${coop?.nome}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn" data-reag="${prox.id}">Reagendar</button>
        <button class="btn ghost" data-cancel="${prox.id}">Cancelar</button>
      </div>
    </div>` : ''}

    <div class="card">
      <h3>Histórico</h3>
      <table class="table">
        <thead>
          <tr><th>Data</th><th>Cooperativa</th><th>Kg</th><th>R$/kg</th><th>Receita</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          ${lista.length ? lista.map(c => {
            const cp = listarCoops().find(co => co.id === c.cooperativaId) || null;
            const preco = cp?.precoKg || (c.pesoKg ? c.valorBruto / c.pesoKg : 0);
            return `<tr>
              <td>${dt(c.data)}</td>
              <td>${cp?.nome || '—'}</td>
              <td>${c.pesoKg ? dec(c.pesoKg) : '—'}</td>
              <td>${preco ? brl(preco) : '—'}</td>
              <td>${c.valorBruto ? brl(c.valorBruto) : '—'}</td>
              <td><span class="tag ${STATUS_TAG[c.status]}">${STATUS_LABEL[c.status]}</span></td>
              <td class="row-actions">
                ${c.status === 'agendada' || c.status === 'pendente'
                  ? `<button class="btn sm" data-reag="${c.id}">Reagendar</button>`
                  : ''}
              </td>
            </tr>`;
          }).join('') : `<tr><td colspan="7"><div class="empty"><div class="ico">📭</div><p>Nenhuma coleta registrada ainda.</p></div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;

  root.querySelector('#solicitar').addEventListener('click', () => abrirSolicitar());
  root.querySelectorAll('[data-reag]').forEach(b => b.addEventListener('click', () => abrirReagendar(b.dataset.reag)));
  root.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => abrirCancelar(b.dataset.cancel)));
}

async function abrirSolicitar() {
  const t = new Date(Date.now() + 86400000);
  const amanha = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  const form = buildForm([
    { name: 'data', label: 'Data desejada', type: 'date', validate: required, min: amanha },
    { name: 'observacao', label: 'Observação (opcional)', type: 'textarea' }
  ], { data: amanha });

  const res = await openModal({
    title: 'Solicitar coleta avulsa',
    body: form.el,
    actions: [
      { label: 'Cancelar', value: false },
      { label: 'Solicitar', variant: 'primary', onClick: () => form.validate() ? form.getValues() : false }
    ]
  });
  if (res) {
    solicitarAvulsa(res);
    toast.success('Coleta solicitada', `Aguardando confirmação para ${dt(res.data)}`);
  }
}

async function abrirReagendar(coletaId) {
  const t = new Date(Date.now() + 86400000);
  const amanha = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  const form = buildForm([
    { name: 'data', label: 'Nova data', type: 'date', validate: required, min: amanha }
  ], { data: amanha });

  const res = await openModal({
    title: 'Reagendar coleta',
    body: form.el,
    actions: [
      { label: 'Cancelar', value: false },
      { label: 'Reagendar', variant: 'primary', onClick: () => form.validate() ? form.getValues() : false }
    ]
  });
  if (res) {
    reagendar(coletaId, res.data);
    toast.success('Coleta reagendada', `Nova data: ${dt(res.data)}`);
  }
}

async function abrirCancelar(coletaId) {
  const ok = await confirm({
    title: 'Cancelar coleta',
    message: 'Tem certeza? A cooperativa será notificada.',
    confirmLabel: 'Cancelar coleta',
    danger: true
  });
  if (ok) {
    cancelar(coletaId);
    toast.info('Coleta cancelada');
  }
}
