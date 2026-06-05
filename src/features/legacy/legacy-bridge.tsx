'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BRAND } from '@/domain/brand';

export function LegacyBridge() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const persona = search.get('p');
    if (persona === 'sindico' || persona === 'morador') {
      router.replace(`/app/login/?p=${persona}`);
      return;
    }
    router.replace('/app/login/');
  }, [router, search]);

  return (
    <main className="loading-screen">
      Redirecionando prototipo antigo para {BRAND.name}...
    </main>
  );
}
