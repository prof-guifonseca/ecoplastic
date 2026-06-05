'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function SplitDonutChart({ split }: { split: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: ['Condominio', 'EcoPlastic'],
        datasets: [{
          data: [split, 1 - split],
          backgroundColor: ['#36d17f', '#f3b35b'],
          borderColor: '#0d1b20',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '64%',
        plugins: {
          legend: { labels: { color: '#94aaa6' } }
        }
      }
    });
    return () => chart.destroy();
  }, [split]);

  return <canvas ref={ref} aria-label="Grafico de reparticao da receita" />;
}
