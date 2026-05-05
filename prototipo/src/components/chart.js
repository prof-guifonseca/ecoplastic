const dark = {
  text: '#8a9aa8',
  grid: 'rgba(36,63,91,.4)',
  brand: '#2ecc71',
  accent: '#f39c12',
  plastic: '#1abc9c'
};

function baseOpts() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: dark.text, font: { size: 11 } } },
      tooltip: { backgroundColor: '#0f1923', borderColor: '#1d3349', borderWidth: 1 }
    },
    scales: {
      x: { ticks: { color: dark.text }, grid: { color: dark.grid } },
      y: { ticks: { color: dark.text }, grid: { color: dark.grid } }
    }
  };
}

export function lineRevenue(canvas, data) {
  if (!window.Chart) return;
  if (canvas._chart) canvas._chart.destroy();
  canvas._chart = new window.Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(d => d.label.toLocaleDateString('pt-BR', { month: 'short' })),
      datasets: [{
        label: 'Receita (R$)',
        data: data.map(d => Math.round(d.receita)),
        borderColor: dark.brand,
        backgroundColor: 'rgba(46,204,113,.15)',
        tension: .3,
        fill: true,
        pointBackgroundColor: dark.brand,
        yAxisID: 'y'
      }, {
        label: 'Kg coletados',
        data: data.map(d => Math.round(d.kg)),
        borderColor: dark.accent,
        backgroundColor: 'rgba(243,156,18,.0)',
        tension: .3,
        yAxisID: 'y1'
      }]
    },
    options: {
      ...baseOpts(),
      scales: {
        x: { ticks: { color: dark.text }, grid: { color: dark.grid } },
        y: { position: 'left', ticks: { color: dark.text }, grid: { color: dark.grid } },
        y1: { position: 'right', ticks: { color: dark.text }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

export function doughnutSplit(canvas, condoPct = 0.7) {
  if (!window.Chart) return;
  if (canvas._chart) canvas._chart.destroy();
  canvas._chart = new window.Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Condomínio', 'EcoTech'],
      datasets: [{
        data: [Math.round(condoPct * 100), Math.round((1 - condoPct) * 100)],
        backgroundColor: [dark.brand, dark.accent],
        borderColor: '#0f1923',
        borderWidth: 2
      }]
    },
    options: {
      ...baseOpts(),
      cutout: '65%',
      scales: {}
    }
  });
}

export function barRanking(canvas, data) {
  if (!window.Chart) return;
  if (canvas._chart) canvas._chart.destroy();
  canvas._chart = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map(d => d.nome.split(' ')[0]),
      datasets: [{
        label: 'Pontos',
        data: data.map(d => d.pontos),
        backgroundColor: dark.plastic,
        borderRadius: 6
      }]
    },
    options: { ...baseOpts(), plugins: { legend: { display: false } } }
  });
}
