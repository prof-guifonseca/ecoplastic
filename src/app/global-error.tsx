'use client';

// Backstop do App Router: captura erros de render na propria raiz (substitui o
// layout). Precisa de <html>/<body> e estilos inline (globals.css pode nao estar
// aplicado neste ponto). Mantem a demo recuperavel, sem tela branca.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#071114', color: '#edf4f1', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 24, maxWidth: 440 }}>
          <h2 style={{ margin: '0 0 8px' }}>Algo deu errado</h2>
          <p style={{ color: '#94aaa6', margin: 0 }}>Recarregue para continuar a demonstracao.</p>
          <button
            onClick={() => reset()}
            style={{ marginTop: 16, padding: '10px 18px', borderRadius: 8, border: 0, background: '#36d17f', color: '#04140b', fontWeight: 800, cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
