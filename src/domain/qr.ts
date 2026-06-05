import { BRAND } from './brand';

export function buildQrPayload(moradorId: string, nonceSeed = 1, timestamp = Date.now()) {
  const raw = Math.abs(Math.sin(nonceSeed + timestamp) * 1_000_000_000_000);
  const nonce = Math.floor(raw).toString(36).slice(0, 8).toUpperCase().padEnd(8, '0');
  return `${BRAND.qrScheme}deposit?morador=${encodeURIComponent(moradorId)}&nonce=${nonce}&ts=${timestamp}`;
}
