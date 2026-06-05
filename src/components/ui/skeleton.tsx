import type { CSSProperties } from 'react';

/** Bloco de carregamento com shimmer (estatico sob prefers-reduced-motion). */
export function Skeleton({ height = 16, width = '100%', radius = 'var(--r-sm)' }: { height?: number | string; width?: number | string; radius?: string }) {
  const style: CSSProperties = { height, width, borderRadius: radius };
  return <span className="skeleton" style={style} aria-hidden="true" />;
}

/** Placeholder para graficos/visualizacoes carregados sob demanda. */
export function ChartSkeleton({ minHeight = 260, label = 'Carregando grafico' }: { minHeight?: number; label?: string }) {
  return (
    <div className="chart-skeleton" style={{ minHeight }} role="status" aria-label={label}>
      <Skeleton height="68%" radius="var(--r-md)" />
    </div>
  );
}
