'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Button, EmptyState } from '@/components/ui/primitives';
import { BRAND } from '@/domain/brand';
import { buildQrPayload } from '@/domain/qr';
import { moradorAtual } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';

const QrCanvas = dynamic(() => import('@/components/qr/qr-canvas').then((mod) => mod.QrCanvas), {
  ssr: false,
  loading: () => <div style={{ width: 236, height: 236, display: 'grid', placeItems: 'center', color: '#071114' }}>QR...</div>
});

const TTL = 60;

export function QrMoradorScreen() {
  const { state, actions } = useEcoPlastic();
  const { notify } = useToast();
  const morador = moradorAtual(state);
  const [remaining, setRemaining] = useState(TTL);
  const [nonce, setNonce] = useState(0);
  const [issuedAt, setIssuedAt] = useState(() => Date.now());
  const payload = useMemo(() => (morador ? buildQrPayload(morador.id, nonce, issuedAt) : ''), [issuedAt, morador, nonce]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setNonce((value) => value + 1);
          setIssuedAt(Date.now());
          return TTL;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!morador) return <EmptyState>Morador nao encontrado.</EmptyState>;

  const simular = () => {
    try {
      const transacao = actions.depositarPET(morador.id, 0.4);
      notify('success', 'Deposito registrado', `+${transacao.pontos} pts (0,4 kg)`);
    } catch (error) {
      notify('error', 'Falha no deposito', error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <>
      <h2 className="p-greet">QR de identificacao</h2>
      <div className="p-qr">
        <div className="qr-frame"><QrCanvas value={payload} /></div>
        <div className="countdown">
          <span>Renova em <b>{remaining}</b>s</span>
          <div className="bar"><div className="fill" style={{ width: `${(remaining / TTL) * 100}%` }} /></div>
        </div>
        <div className="sub">{morador.nome} · Apto {morador.apto}</div>
        <ol>
          <li>Aproxime-se da maquina compactadora {BRAND.name}</li>
          <li>Mostre este QR para o leitor superior</li>
          <li>Insira a garrafa PET no compartimento</li>
          <li>Pontos creditados automaticamente</li>
        </ol>
        <Button variant="primary" onClick={simular} style={{ width: '100%' }}>♻ Simular deposito (0,4 kg)</Button>
        <small className="sub" style={{ textAlign: 'center' }}>Payload local: {BRAND.qrScheme}</small>
      </div>
    </>
  );
}
