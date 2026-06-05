'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Persona } from '@/domain/types';
import { useEcoPlastic } from '@/store/ecoplastic-store';

export function AuthGuard({ persona, children }: { persona: Exclude<Persona, null>; children: React.ReactNode }) {
  const router = useRouter();
  const { state, hydrated } = useEcoPlastic();

  useEffect(() => {
    if (!hydrated) return;
    if (state.persona !== persona) router.replace('/app/login/');
  }, [hydrated, persona, router, state.persona]);

  if (!hydrated) return <main className="loading-screen">Carregando EcoPlastic...</main>;
  if (state.persona !== persona) return <main className="loading-screen">Redirecionando...</main>;
  return <>{children}</>;
}
