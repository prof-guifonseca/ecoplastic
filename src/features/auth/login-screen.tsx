'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Building2, Smartphone } from 'lucide-react';
import { BRAND } from '@/domain/brand';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';

export function LoginScreen() {
  const router = useRouter();
  const search = useSearchParams();
  const { state, actions, hydrated } = useEcoPlastic();
  const { notify } = useToast();
  const julia = useMemo(() => state.moradores.find((morador) => morador.nome.startsWith('Julia')) ?? state.moradores[0], [state.moradores]);
  const juliaId = julia?.id ?? '';
  const quickPersona = search.get('p');
  const [selectedMorador, setSelectedMorador] = useState(julia?.id ?? '');
  const selectedMoradorId = state.moradores.some((morador) => morador.id === selectedMorador) ? selectedMorador : julia?.id ?? '';

  useEffect(() => {
    if (!hydrated) return;
    if (quickPersona === 'sindico') {
      if (state.persona !== 'sindico') actions.entrarComoSindico();
      router.replace('/app/sindico/dashboard/');
    }
    if (quickPersona === 'morador' && juliaId) {
      if (state.persona !== 'morador' || state.currentMoradorId !== juliaId) actions.entrarComoMorador(juliaId);
      router.replace('/app/morador/inicio/');
    }
  }, [actions, hydrated, juliaId, quickPersona, router, state.currentMoradorId, state.persona]);

  const entrarSindico = () => {
    actions.entrarComoSindico();
    notify('success', 'Bem-vindo ao painel do sindico');
    router.push('/app/sindico/dashboard/');
  };

  const entrarMorador = (moradorId: string) => {
    actions.entrarComoMorador(moradorId);
    notify('success', 'App do morador aberto');
    router.push('/app/morador/inicio/');
  };

  return (
    <main className="login">
      <section className="login-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
          <div className="login-brand">
            <div className="logo">♻</div>
            <div>
              <h1>{BRAND.name}</h1>
              <small style={{ color: 'var(--c-muted)' }}>Recycle-as-a-Service · {state.condominio.nome}</small>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <Link className="btn ghost sm" href="/">Voltar a entrada</Link>
            <Link className="btn ghost sm" href="/equipamento/">Conhecer equipamento</Link>
          </div>
        </div>

        <p className="login-sub">Escolha o perfil para iniciar a demonstracao offline.</p>

        <div className="login-personas">
          <button className="persona-card" type="button" onClick={entrarSindico}>
            <div className="ico"><Building2 size={36} /></div>
            <h3>Sindico - Marcos Vieira</h3>
            <p>Acesso ao painel de gestao: dashboard, coletas, financeiro, moradores, ESG, backup e configuracoes.</p>
          </button>
          <button className="persona-card" type="button" onClick={() => entrarMorador(julia.id)}>
            <div className="ico"><Smartphone size={36} /></div>
            <h3>Morador - {julia.nome}</h3>
            <p>Apto {julia.apto} · {julia.pontos.toLocaleString('pt-BR')} pts · QR, historico, ranking e recompensas.</p>
          </button>
        </div>

        <div className="login-other">
          <label htmlFor="otherMorador">Entrar como outro morador</label>
          <select id="otherMorador" value={selectedMoradorId} onChange={(event) => setSelectedMorador(event.target.value)}>
            {state.moradores.map((morador) => (
              <option value={morador.id} key={morador.id}>
                {morador.nome} (apto {morador.apto})
              </option>
            ))}
          </select>
          <button className="btn primary" type="button" onClick={() => entrarMorador(selectedMoradorId)} disabled={!selectedMoradorId}>
            Entrar
          </button>
        </div>
      </section>
    </main>
  );
}
