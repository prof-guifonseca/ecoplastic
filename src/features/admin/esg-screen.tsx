'use client';

import { Download, Mail, Share2 } from 'lucide-react';
import { Button, Card } from '@/components/ui/primitives';
import { BRAND } from '@/domain/brand';
import { dec, num } from '@/domain/format';
import { saveEsgPdf } from '@/domain/pdf';
import { metricasEsg } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';
import { DemoTag, SourceNote } from '@/components/ui/source-note';

export function EsgScreen() {
  const { state } = useEcoPlastic();
  const { notify } = useToast();
  const metrics = metricasEsg(state);

  const shareText = `${state.condominio.nome} ja reciclou ${dec(metrics.kg)} kg de PET - ${num(metrics.garrafas)} garrafas e ${metrics.co2Toneladas} t de CO2 evitadas. ${BRAND.name} em acao!`;

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Relatorio ESG', text: shareText });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(shareText);
    notify('success', 'Mensagem copiada');
  };

  const download = () => {
    try {
      saveEsgPdf(state);
      notify('success', 'PDF gerado');
    } catch (error) {
      notify('error', 'Falha ao gerar PDF', error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Relatorio ESG</h1>
          <div className="sub">Impactos ambientais do predio para assembleias e comunicados</div>
          <div style={{ marginTop: 8 }}><DemoTag /></div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={compartilhar}><Share2 size={17} /> Compartilhar</Button>
          <Button variant="primary" onClick={download}><Download size={17} /> Baixar PDF</Button>
        </div>
      </div>

      <div className="banner" style={{ marginBottom: 16 }}>
        <div className="ico">📈</div>
        <div className="body">
          <b>Por que isso importa:</b> o relatorio transforma descarte em evidencia ambiental rastreavel para moradores, sindico e cooperativa.
        </div>
      </div>

      <div className="grid grid-2">
        <Card>
          <h3>Pre-visualizacao do PDF</h3>
          <div style={{ background: '#f8fffc', color: '#243232', borderRadius: 'var(--r-md)', padding: 22 }}>
            <h2 style={{ margin: 0 }}>Relatorio ESG · {state.condominio.nome}</h2>
            <div style={{ color: '#66807a', marginTop: 4 }}>Periodo acumulado · {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
            <div className="grid grid-3" style={{ margin: '22px 0' }}>
              <div><b style={{ fontSize: 24, color: '#1e9f5a' }}>{dec(metrics.kg)} kg</b><br /><span>PET reciclado</span></div>
              <div><b style={{ fontSize: 24, color: '#1e9f5a' }}>{num(metrics.garrafas)}</b><br /><span>Garrafas PET</span></div>
              <div><b style={{ fontSize: 24, color: '#1e9f5a' }}>{metrics.co2Toneladas} t</b><br /><span>CO2 evitado</span></div>
            </div>
            <p>Equivalente a {num(metrics.garrafas)} garrafas PET fora do aterro, {num(metrics.aguaLitros)} litros de agua economizados (producao) e {num(metrics.energiaKwh)} kWh poupados.</p>
          </div>
          <SourceNote>
            Fatores: CO2 0,0015 t/kg e energia 5,4 kWh/kg (APR 2020; ACS 2018); garrafas a 25 g; agua escopo producao. Dados demonstrativos, ver docs/metodologia-esg.md.
          </SourceNote>
        </Card>

        <div className="grid">
          <Card>
            <h3>Equivalencias ambientais</h3>
            <div className="form-grid">
              <div className="next-pickup"><span>🍶 Garrafas fora do aterro</span><b>{num(metrics.garrafas)}</b></div>
              <div className="next-pickup"><span>💧 Litros de agua</span><b>{num(metrics.aguaLitros)}</b></div>
              <div className="next-pickup"><span>⚡ kWh economizados</span><b>{num(metrics.energiaKwh)}</b></div>
            </div>
          </Card>
          <Card>
            <h3>Canais de compartilhamento</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}>WhatsApp</Button>
              <Button onClick={() => window.open(`mailto:?subject=${encodeURIComponent('Relatorio ESG do condominio')}&body=${encodeURIComponent(shareText)}`)}><Mail size={16} /> E-mail</Button>
              <Button onClick={compartilhar}>Copiar texto</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
