import { getState } from '../core/store.js';
import { totaisMensais } from './coletas.js';
import { brl, dec, num } from '../core/format.js';

export function metricas() {
  const totalKg = getState().coletas
    .filter(c => c.status === 'concluida')
    .reduce((s, c) => s + c.pesoKg, 0);
  return {
    kg: totalKg,
    garrafas: Math.round(totalKg * 30),     // ~30 garrafas PET / kg
    co2Toneladas: +(totalKg * 0.0027).toFixed(2),
    arvores: Math.round(totalKg * 0.045),
    aguaLitros: Math.round(totalKg * 10),
    energiaKwh: Math.round(totalKg * 5.4)
  };
}

export async function exportPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const m = metricas();
  const cond = getState().condominio;
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(46, 204, 113);
  doc.rect(0, 0, W, 70, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Relatório ESG — EcoPlastic', 40, 32);
  doc.setFontSize(11);
  doc.text(cond.nome, 40, 52);

  // Body
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(13);
  doc.text(`Período acumulado · ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`, 40, 100);
  doc.setFontSize(10);
  doc.setTextColor(94, 111, 128);
  doc.text(cond.endereco, 40, 116);

  // KPI cards
  const kpis = [
    { l: 'Plástico reciclado', v: `${dec(m.kg)} kg` },
    { l: 'Garrafas PET', v: num(m.garrafas) },
    { l: 'CO₂ evitado', v: `${m.co2Toneladas} t` }
  ];
  let y = 150;
  kpis.forEach((k, i) => {
    const x = 40 + i * 175;
    doc.setDrawColor(214, 223, 232);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(x, y, 165, 70, 8, 8, 'FD');
    doc.setTextColor(94, 111, 128);
    doc.setFontSize(9);
    doc.text(k.l.toUpperCase(), x + 12, y + 22);
    doc.setTextColor(46, 204, 113);
    doc.setFontSize(18);
    doc.text(String(k.v), x + 12, y + 50);
  });

  // Equivalências
  y = 250;
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(13);
  doc.text('Equivalências ambientais', 40, y);
  y += 18;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const eq = [
    `🌳  ${m.arvores} árvores preservadas`,
    `💧  ${num(m.aguaLitros)} litros de água economizados`,
    `⚡  ${num(m.energiaKwh)} kWh de energia poupados`,
    `♻️  ${num(m.garrafas)} garrafas PET fora do aterro`
  ];
  eq.forEach(line => { doc.text(line, 40, y); y += 16; });

  // Histórico mensal
  y += 16;
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text('Evolução mensal', 40, y);
  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(94, 111, 128);
  doc.text('Mês', 40, y); doc.text('Kg coletados', 220, y); doc.text('Receita', 380, y);
  y += 6;
  doc.setDrawColor(214, 223, 232);
  doc.line(40, y, W - 40, y);
  y += 14;
  totaisMensais().forEach(t => {
    if (y > 760) return;
    doc.setTextColor(40, 40, 40);
    const lbl = t.label.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    doc.text(lbl, 40, y);
    doc.text(`${dec(t.kg)} kg`, 220, y);
    doc.text(brl(t.receita), 380, y);
    y += 16;
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Gerado por EcoPlastic · plataforma Recycle-as-a-Service para condomínios', 40, 820);

  const fname = `ESG_${cond.nome.replace(/\W+/g, '_')}_${new Date().toISOString().slice(0, 7)}.pdf`;
  doc.save(fname);
}

export function shareText() {
  const m = metricas();
  const c = getState().condominio;
  return `🌱 ${c.nome} já reciclou ${dec(m.kg)} kg de PET — ${num(m.garrafas)} garrafas e ${m.co2Toneladas} t de CO₂ evitadas. EcoPlastic em ação!`;
}
