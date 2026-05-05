import { metricas, exportPdf, shareText } from '../../services/esg.js';
import { getState } from '../../core/store.js';
import { dec, num } from '../../core/format.js';
import { toast } from '../../components/toast.js';

export function renderEsg(root) {
  const m = metricas();
  const cond = getState().condominio;

  root.innerHTML = `
    <div class="topbar">
      <div><h1>Relatório ESG</h1><div class="sub">Compartilhe os impactos ambientais do prédio</div></div>
      <div style="display:flex;gap:8px">
        <button class="btn" id="shareAll">📤 Compartilhar com moradores</button>
        <button class="btn primary" id="downloadPdf">⬇ Baixar PDF</button>
      </div>
    </div>

    <div class="banner" style="margin-bottom:16px">
      <div class="ico">📈</div>
      <div class="body">
        <b>Por que isso importa:</b> empreendimentos com relatório ESG mensal valorizam <b>4–8%</b> em São Paulo (FipeZap, 2025). Use este PDF em assembleias e anúncios.
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Pré-visualização do PDF</h3>
        <div class="esg-preview">
          <h2>Relatório ESG · ${cond.nome}</h2>
          <div class="sub">Período acumulado · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
          <div class="stats">
            <div class="stat"><div class="v">${dec(m.kg)} kg</div><div class="l">PET reciclado</div></div>
            <div class="stat"><div class="v">${num(m.garrafas)}</div><div class="l">Garrafas PET</div></div>
            <div class="stat"><div class="v">${m.co2Toneladas} t</div><div class="l">CO₂ evitado</div></div>
          </div>
          <p style="font-size:13px;color:#5e6f80;margin:0">
            Equivalente a ${m.arvores} árvores preservadas, ${num(m.aguaLitros)} litros de água economizados e ${num(m.energiaKwh)} kWh poupados.
          </p>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:16px">
          <h3>Equivalências ambientais</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;justify-content:space-between;padding:10px;background:var(--c-bg-2);border-radius:var(--r-md)"><span>🌳 Árvores preservadas</span><b>${m.arvores}</b></div>
            <div style="display:flex;justify-content:space-between;padding:10px;background:var(--c-bg-2);border-radius:var(--r-md)"><span>💧 Litros de água</span><b>${num(m.aguaLitros)}</b></div>
            <div style="display:flex;justify-content:space-between;padding:10px;background:var(--c-bg-2);border-radius:var(--r-md)"><span>⚡ kWh economizados</span><b>${num(m.energiaKwh)}</b></div>
          </div>
        </div>

        <div class="card">
          <h3>Compartilhar</h3>
          <div class="share-buttons" style="margin-top:8px">
            <button class="btn" data-share="wa">💬 WhatsApp</button>
            <button class="btn" data-share="mail">✉️ E-mail</button>
            <button class="btn" data-share="ig">📷 Instagram</button>
            <button class="btn" data-share="copy">🔗 Copiar link</button>
          </div>
        </div>
      </div>
    </div>
  `;

  root.querySelector('#downloadPdf').addEventListener('click', async () => {
    if (!window.jspdf) { toast.error('Gerando…', 'Aguarde a biblioteca carregar e tente novamente.'); return; }
    try { await exportPdf(); toast.success('PDF baixado'); }
    catch (e) { toast.error('Falha ao gerar PDF', e.message); }
  });

  root.querySelector('#shareAll').addEventListener('click', async () => {
    const txt = shareText();
    if (navigator.share) {
      try { await navigator.share({ title: 'Relatório ESG', text: txt }); return; } catch {}
    }
    await navigator.clipboard.writeText(txt);
    toast.success('Mensagem copiada');
  });

  root.querySelectorAll('[data-share]').forEach(b => {
    b.addEventListener('click', () => doShare(b.dataset.share));
  });
}

async function doShare(kind) {
  const txt = shareText();
  const url = location.origin + location.pathname;
  if (kind === 'wa') {
    window.open(`https://wa.me/?text=${encodeURIComponent(txt + ' ' + url)}`, '_blank');
    toast.info('Abrindo WhatsApp…');
  } else if (kind === 'mail') {
    window.open(`mailto:?subject=${encodeURIComponent('Relatório ESG do condomínio')}&body=${encodeURIComponent(txt)}`);
    toast.info('Abrindo cliente de e-mail…');
  } else if (kind === 'ig') {
    await navigator.clipboard.writeText(txt);
    toast.success('Texto copiado', 'Cole no story ou na bio do Instagram.');
  } else if (kind === 'copy') {
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado');
  }
}
