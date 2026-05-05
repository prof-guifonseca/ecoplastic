import { buildPayload, renderInto } from '../../services/qr.js';
import { depositoPlastico } from '../../services/transacoes.js';
import { toast } from '../../components/toast.js';

const TTL = 60;
let timer = null;

export function stopQrTimer() {
  if (timer) { clearInterval(timer); timer = null; }
}

export function renderQr(root, morador) {
  stopQrTimer();

  let payload = buildPayload(morador.id);
  let remaining = TTL;

  root.innerHTML = `
    <h2 class="p-greet">QR de identificação</h2>
    <div class="p-qr">
      <div class="frame" id="qrFrame"></div>
      <div class="countdown">
        <span>Renova em <b id="cd">${remaining}</b>s</span>
        <div class="bar"><div class="fill" id="cdFill" style="width:100%"></div></div>
      </div>
      <div class="info">${morador.nome} · Apto ${morador.apto}</div>
      <ol>
        <li>Aproxime-se da máquina compactadora EcoTech</li>
        <li>Mostre este QR para o leitor superior</li>
        <li>Insira a garrafa PET no compartimento</li>
        <li>Pontos creditados automaticamente</li>
      </ol>
      <button class="btn primary" id="simular" style="width:100%">♻️ Simular depósito (0,4 kg)</button>
      <small style="color:var(--c-muted);text-align:center">Modo demonstração — dispara o fluxo como se a máquina tivesse lido o QR.</small>
    </div>
  `;

  const frame = root.querySelector('#qrFrame');
  renderInto(frame, payload);

  timer = setInterval(() => {
    if (!root.isConnected) { stopQrTimer(); return; }
    remaining--;
    const cd = root.querySelector('#cd');
    const cdFill = root.querySelector('#cdFill');
    if (remaining <= 0) {
      remaining = TTL;
      payload = buildPayload(morador.id);
      renderInto(root.querySelector('#qrFrame'), payload);
    }
    if (cd) cd.textContent = remaining;
    if (cdFill) cdFill.style.width = `${(remaining / TTL) * 100}%`;
  }, 1000);

  root.querySelector('#simular').addEventListener('click', () => {
    const t = depositoPlastico({ moradorId: morador.id, kg: 0.4 });
    toast.success('Depósito registrado!', `+${t.pontos} pts (0,4 kg)`);
  });
}
