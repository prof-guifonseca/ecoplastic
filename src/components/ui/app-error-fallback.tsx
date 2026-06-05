'use client';

import { BRAND } from '@/domain/brand';

/**
 * Fallback de topo da aplicacao. Crucial para a demo da feira: um estado
 * corrompido em localStorage nao pode travar o notebook. Oferece recarregar e
 * resetar os dados de demonstracao (limpa a chave e recarrega).
 */
export function AppErrorFallback() {
  const reset = () => {
    try {
      localStorage.removeItem(BRAND.storageKey);
    } catch {
      // ignora: ambiente sem localStorage
    }
    location.reload();
  };

  return (
    <main className="loading-screen">
      <div className="text-center max-w-[440px] p-6">
        <h2>Algo deu errado</h2>
        <p className="sub">A demonstracao continua disponivel. Recarregue a pagina ou reinicie os dados de demonstracao.</p>
        <div className="flex gap-2 justify-center mt-4">
          <button className="btn primary" onClick={() => location.reload()}>Recarregar</button>
          <button className="btn ghost" onClick={reset}>Resetar demonstracao</button>
        </div>
      </div>
    </main>
  );
}
