import Link from 'next/link';
import { ArrowRight, Building2, Smartphone, Wrench } from 'lucide-react';
import { BRAND } from '@/domain/brand';

export default function HomePage() {
  return (
    <main className="landing">
      <section>
        <p style={{ color: 'var(--c-accent)', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Recycle-as-a-Service
        </p>
        <h1>{BRAND.name}</h1>
        <p>
          Compactador inteligente de PET para condominios com pontos, recompensas,
          gestao de coletas, simulador financeiro e relatorio ESG pronto para demonstracao.
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
      <section className="medal" aria-hidden="true">
        <div className="mark">♻</div>
      </section>
    </main>
  );
}
