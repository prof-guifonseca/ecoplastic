import type { ReactNode } from 'react';

/**
 * Nota de proveniencia/fonte exibida proxima a numeros estimados.
 * Mantem a honestidade cientifica visivel (dados demonstrativos + fontes).
 */
export function SourceNote({ children }: { children: ReactNode }) {
  return (
    <p className="source-note">
      <i className="mark" aria-hidden="true">&#9432;</i>
      <span>{children}</span>
    </p>
  );
}

/** Etiqueta compacta "Dados demonstrativos" para cabecalhos de tela. */
export function DemoTag({ children = 'Dados demonstrativos' }: { children?: ReactNode }) {
  return (
    <span className="disclaimer-tag">
      <span className="dot" aria-hidden="true" />
      {children}
    </span>
  );
}
