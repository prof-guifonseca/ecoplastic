import Link from 'next/link';
import { ArrowRight, Building2, Leaf, Recycle, Smartphone, Wrench } from 'lucide-react';
import { BRAND } from '@/domain/brand';
import { buildSeed } from '@/domain/seed';
import { brl, dec, num } from '@/domain/format';
import { metricasEsg, saldoCondominio } from '@/domain/selectors';

// Numeros do cenario de demonstracao, calculados no build (export estatico).
const demo = buildSeed();
const metrics = metricasEsg(demo);
const receita = saldoCondominio(demo);

export default function HomePage() {
  return (
    <main className="landing">
      <section>
        <p className="eyebrow-brand">Projeto FECCI 2026 · Recycle-as-a-Service</p>
        <h1>{BRAND.name}</h1>
        <p className="landing-lead">
          O compactador inteligente de PET que transforma o lixo do condominio em
          pontos, recompensas e receita — com relatorio ESG e operacao 100% offline.
        </p>
        <div className="landing-actions">
          <Link className="btn primary" href="/app/login/?p=sindico">
            <Building2 size={18} /> Entrar como sindico
          </Link>
          <Link className="btn secondary" href="/app/login/?p=morador">
            <Smartphone size={18} /> App do morador
          </Link>
          <Link className="btn ghost" href="/equipamento/">
            <Wrench size={18} /> Conheca o equipamento <ArrowRight size={16} />
          </Link>
        </div>
        <div className="proof-strip" aria-label="Resumo do MVP">
          <div><b>offline</b><span>estado local versionado</span></div>
          <div><b>ESG</b><span>PDF e compartilhamento</span></div>
          <div><b>QR</b><span>deposito simulado e rastreavel</span></div>
        </div>
      </section>
      <section className="landing-showcase" aria-label="Resultados do cenario de demonstracao">
        <div className="showcase-badge"><Leaf size={15} /> Cenario demonstrativo</div>
        <div className="showcase-figure">
          <span className="showcase-value">{dec(metrics.kg)}</span>
          <span className="showcase-unit">kg de PET reciclados no predio</span>
        </div>
        <div className="showcase-stats">
          <div><b>{num(metrics.garrafas)}</b><span>garrafas fora do aterro</span></div>
          <div><b>{metrics.co2Toneladas} t</b><span>CO2 evitado</span></div>
          <div><b>{brl(receita)}</b><span>receita ao condominio</span></div>
        </div>
        <div className="showcase-foot"><Recycle size={15} /> {BRAND.name} Station · compactador + app + cooperativa</div>
      </section>
    </main>
  );
}
