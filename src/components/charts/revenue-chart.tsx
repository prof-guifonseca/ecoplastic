'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface RevenuePoint {
  label: Date;
  kg: number;
  receita: number;
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: data.map((point) => point.label.toLocaleDateString('pt-BR', { month: 'short' })),
        datasets: [
          {
            label: 'Receita',
            data: data.map((point) => point.receita),
            borderColor: '#36d17f',
            backgroundColor: 'rgba(54,209,127,.16)',
            tension: .35,
            fill: true,
            pointRadius: 3
          },
          {
            label: 'Kg coletados',
            data: data.map((point) => point.kg),
            borderColor: '#36c7d0',
            backgroundColor: 'rgba(54,199,208,.12)',
            tension: .35,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94aaa6' } }
        },
        scales: {
          x: { ticks: { color: '#94aaa6' }, grid: { color: 'rgba(255,255,255,.05)' } },
          y: { ticks: { color: '#94aaa6' }, grid: { color: 'rgba(255,255,255,.06)' } },
          y1: {
            position: 'right',
            ticks: { color: '#94aaa6' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} aria-label="Grafico de evolucao de receita e kg" />;
}
