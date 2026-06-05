import { Suspense } from 'react';
import { LoginScreen } from '@/features/auth/login-screen';

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="loading-screen">Carregando login...</main>}>
      <LoginScreen />
    </Suspense>
  );
}
