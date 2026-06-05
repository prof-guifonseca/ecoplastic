'use client';

import { ToastProvider } from '@/components/ui/toast';
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';
import { EcoPlasticProvider } from '@/store/ecoplastic-store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EcoPlasticProvider>
      <ToastProvider>
        {children}
        <ServiceWorkerRegister />
      </ToastProvider>
    </EcoPlasticProvider>
  );
}
