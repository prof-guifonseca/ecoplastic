import { nonce } from '../core/id.js';

export function buildPayload(moradorId) {
  return JSON.stringify({ m: moradorId, ts: Date.now(), n: nonce() });
}

/**
 * Render a QR code into a container element. Replaces previous content.
 * Uses davidshimjs/qrcodejs API (window.QRCode constructor).
 */
export function renderInto(container, payload) {
  if (!container) return;
  container.innerHTML = '';
  if (!window.QRCode) {
    container.innerHTML = '<div style="color:#5e6f80;font-size:12px;text-align:center">Carregando QR…</div>';
    return;
  }
  try {
    new window.QRCode(container, {
      text: payload,
      width: 180,
      height: 180,
      colorDark: '#0a1218',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel?.H || 2
    });
  } catch (e) {
    console.warn('[qr] render failed', e);
    container.innerHTML = '<div style="color:#ff6b6b;font-size:12px;text-align:center">Erro ao gerar QR</div>';
  }
}
