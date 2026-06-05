'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export function QrCanvas({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(ref.current, value, {
      margin: 1,
      width: 236,
      color: {
        dark: '#071114',
        light: '#f8fffc'
      }
    }).catch((error) => console.error('[EcoPlastic] QR failed', error));
  }, [value]);

  return <canvas ref={ref} aria-label="QR de identificacao EcoPlastic" />;
}
