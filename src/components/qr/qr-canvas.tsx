'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export function QrCanvas({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(ref.current, value, {
      margin: 1,
      width: 236,
      color: {
        dark: '#071114',
        light: '#f8fffc'
      }
    })
      .then(() => setFailed(false))
      .catch((error) => {
        console.error('[EcoPlastic] QR failed', error);
        setFailed(true);
      });
  }, [value]);

  // Canvas fica sempre montado (ref valido p/ re-tentar a cada novo payload);
  // o fallback textual entra no lugar quando a geracao falha, para o passo de
  // deposito nunca virar um quadrado em branco na demonstracao.
  return (
    <>
      <canvas ref={ref} aria-label="QR de identificacao EcoPlastic" hidden={failed} />
      {failed ? (
        <div className="qr-fallback" role="img" aria-label="Codigo de identificacao EcoPlastic">
          <strong>Codigo de identificacao</strong>
          <code>{value}</code>
          <span>Mostre este codigo ao operador da maquina.</span>
        </div>
      ) : null}
    </>
  );
}
