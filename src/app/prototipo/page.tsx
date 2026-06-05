import { Suspense } from 'react';
import { LegacyBridge } from '@/features/legacy/legacy-bridge';

export default function LegacyPrototypePage() {
  return (
    <Suspense fallback={<main className="loading-screen">Redirecionando...</main>}>
      <LegacyBridge />
    </Suspense>
  );
}
