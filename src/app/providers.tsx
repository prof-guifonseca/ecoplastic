'use client';

import { ToastProvider } from '@/components/ui/toast';
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AppErrorFallback } from '@/components/ui/app-error-fallback';
import { ConfirmProvider } from '@/components/ui/dialog';
import { EcoPlasticProvider } from '@/store/ecoplastic-store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <EcoPlasticProvider>
        <ToastProvider>
          <ConfirmProvider>
            {children}
            <ServiceWorkerRegister />
          </ConfirmProvider>
        </ToastProvider>
      </EcoPlasticProvider>
    </ErrorBoundary>
  );
}
