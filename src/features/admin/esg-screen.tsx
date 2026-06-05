'use client';

import { Download, Mail, Share2 } from 'lucide-react';
import { Button, Card } from '@/components/ui/primitives';
import { Droplet, Recycle, TrendingUp, Zap } from '@/components/ui/icons';
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
          <div className="mt-2"><DemoTag /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={compartilhar}><Share2 size={17} /> Compartilhar</Button>
          <Button variant="primary" onClick={download}><Download size={17} /> Baixar PDF</Button>
        </div>
      </div>

      <div className="banner mb-4">
        <div className="ico"><TrendingUp size={22} /></div>
        <div className="body">
          <b>Por que isso importa:</b> o relatorio transforma descarte em evidencia ambiental rastreavel para moradores, sindico e cooperativa.
        </div>
      </div>

      <div className="grid grid-2">
        <Card>
          <h3>Pre-visualizacao do PDF</h3>
          <div className="paper-card">
            <h2>Relatorio ESG · {state.condominio.nome}</h2>
            <div className="muted mt-1">Periodo acumulado · {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
            <div className="grid grid-3 my-5">
              <div><b className="figure">{dec(metrics.kg)} kg</b><br /><span>PET reciclado</span></div>
              <div><b className="figure">{num(metrics.garrafas)}</b><br /><span>Garrafas PET</span></div>
              <div><b className="figure">{metrics.co2Toneladas} t</b><br /><span>CO2 evitado</span></div>
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
              <div className="next-pickup"><span className="inline-flex items-center gap-2"><Recycle size={16} /> Garrafas fora do aterro</span><b>{num(metrics.garrafas)}</b></div>
              <div className="next-pickup"><span className="inline-flex items-center gap-2"><Droplet size={16} /> Litros de agua</span><b>{num(metrics.aguaLitros)}</b></div>
              <div className="next-pickup"><span className="inline-flex items-center gap-2"><Zap size={16} /> kWh economizados</span><b>{num(metrics.energiaKwh)}</b></div>
            </div>
          </Card>
          <Card>
            <h3>Canais de compartilhamento</h3>
            <div className="flex flex-wrap gap-2">
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
