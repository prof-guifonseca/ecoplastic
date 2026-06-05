'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Boxes, Maximize2, Play, Recycle } from 'lucide-react';
import { BRAND } from '@/domain/brand';
import { Card } from '@/components/ui/primitives';

const EquipmentViewer = dynamic(() => import('@/components/equipment/equipment-viewer').then((mod) => mod.EquipmentViewer), {
  ssr: false,
  loading: () => <div className="loading-screen" style={{ minHeight: 620 }}>Carregando compactador 3D...</div>
});

export default function EquipamentoPage() {
  return (
    <main className="equipment-page">
      <Link className="btn ghost" href="/" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> Voltar</Link>
      <section className="equipment-hero">
        <div>
          <p style={{ color: 'var(--c-accent)', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Compactador inteligente de PET
          </p>
          <h1>{BRAND.name} Station</h1>
          <p>
            Cabine compactadora horizontal para condominios, com leitura de QR, contador de massa,
            telemetria demonstravel, armazenagem compactada e integracao direta ao app do morador.
          </p>
          <div className="landing-actions">
            <Link className="btn primary" href="/app/login/?p=sindico"><Play size={17} /> Abrir MVP</Link>
            <Link className="btn secondary" href="/app/login/?p=morador"><Recycle size={17} /> Simular descarte</Link>
            <a className="btn ghost" href="#prototipo-3d"><Boxes size={17} /> Ver protótipo 3D completo</a>
          </div>
          <div className="spec-list">
            <div><span>Capacidade demonstrada</span><b>250 kg</b></div>
            <div><span>Fluxo principal</span><b>QR + PET + pontos</b></div>
            <div><span>Modelo de operacao</span><b>SaaS + cooperativa</b></div>
            <div><span>Persistencia MVP</span><b>localStorage + backup JSON</b></div>
          </div>
        </div>
        <Card className="viewer-card">
          <EquipmentViewer />
        </Card>
      </section>

      <section id="prototipo-3d" className="prototipo-3d-section">
        <div className="topbar">
          <div>
            <h2>Protótipo 3D completo</h2>
            <p className="sub">Prensa, tanque, portinhola, vista explodida, raio-X e lista de materiais (BOM) &mdash; interativo e roda offline.</p>
          </div>
          <Link className="btn secondary" href="/prototipo-3d/" target="_blank" rel="noopener"><Maximize2 size={16} /> Abrir em tela cheia</Link>
        </div>
        <Card className="prototipo-embed">
          <iframe
            src="/prototipo-3d/"
            title="Protótipo 3D completo do compactador EcoPlastic"
            className="prototipo-iframe"
            loading="lazy"
          />
        </Card>
      </section>
    </main>
  );
}
