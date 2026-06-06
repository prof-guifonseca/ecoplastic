import { jsPDF } from 'jspdf';
import { BRAND } from './brand';
import { brl, dec, num } from './format';
import { metricasEsg, totaisMensais } from './selectors';
import { PAPER, PAPER_BRAND, PAPER_BRAND_INK } from './theme';
import type { EcoPlasticState } from './types';

// Desenho separado do save: buildEsgDoc e testavel em ambiente node
// (output('arraybuffer')); saveEsgPdf so adiciona o doc.save() (Blob/DOM).
export function buildEsgDoc(state: EcoPlasticState) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const metrics = metricasEsg(state);
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(...PAPER_BRAND.rgb);
  doc.rect(0, 0, width, 72, 'F');
  doc.setTextColor(...PAPER_BRAND_INK.rgb);
  doc.setFontSize(20);
  doc.text(`Relatorio ESG - ${BRAND.name}`, 40, 34);
  doc.setFontSize(11);
  doc.text(state.condominio.nome, 40, 54);

  doc.setTextColor(...PAPER.ink.rgb);
  doc.setFontSize(13);
  doc.text(`Periodo acumulado - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`, 40, 102);
  doc.setFontSize(10);
  doc.setTextColor(...PAPER.inkMuted.rgb);
  doc.text(state.condominio.endereco, 40, 118);

  const kpis = [
    { label: 'Plastico reciclado', value: `${dec(metrics.kg)} kg` },
    { label: 'Garrafas PET', value: num(metrics.garrafas) },
    { label: 'CO2 evitado', value: `${metrics.co2Toneladas} t` }
  ];

  for (const [index, kpi] of kpis.entries()) {
    const x = 40 + index * 175;
    doc.setDrawColor(...PAPER.border.rgb);
    doc.setFillColor(...PAPER.bg.rgb);
    doc.roundedRect(x, 150, 165, 70, 8, 8, 'FD');
    doc.setTextColor(...PAPER.inkMuted.rgb);
    doc.setFontSize(9);
    doc.text(kpi.label.toUpperCase(), x + 12, 172);
    doc.setTextColor(...PAPER.accent.rgb);
    doc.setFontSize(18);
    doc.text(kpi.value, x + 12, 200);
  }

  let y = 252;
  doc.setTextColor(...PAPER.ink.rgb);
  doc.setFontSize(13);
  doc.text('Equivalencias ambientais', 40, y);
  y += 22;
  doc.setFontSize(11);
  doc.setTextColor(...PAPER.inkMuted.rgb);
  [
    `${num(metrics.garrafas)} garrafas PET fora do aterro`,
    `${num(metrics.aguaLitros)} litros de agua economizados (producao)`,
    `${num(metrics.energiaKwh)} kWh de energia poupados`
  ].forEach((line) => {
    doc.text(line, 40, y);
    y += 17;
  });

  y += 18;
  doc.setFontSize(13);
  doc.setTextColor(...PAPER.ink.rgb);
  doc.text('Evolucao mensal', 40, y);
  y += 18;
  doc.setFontSize(10);
  doc.setTextColor(...PAPER.inkMuted.rgb);
  doc.text('Mes', 40, y);
  doc.text('Kg coletados', 220, y);
  doc.text('Receita', 380, y);
  y += 8;
  doc.setDrawColor(...PAPER.border.rgb);
  doc.line(40, y, width - 40, y);
  y += 16;
  for (const item of totaisMensais(state)) {
    doc.setTextColor(...PAPER.ink.rgb);
    doc.text(item.label.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }), 40, y);
    doc.text(`${dec(item.kg)} kg`, 220, y);
    doc.text(brl(item.receita), 380, y);
    y += 17;
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Indicadores estimados com fatores da literatura (APR 2020, ACS 2018) sobre dados demonstrativos. Ver docs/metodologia-esg.md.', 40, 806, { maxWidth: width - 80 });
  doc.setFontSize(9);
  doc.setTextColor(145, 145, 145);
  doc.text(`Gerado por ${BRAND.name} - plataforma Recycle-as-a-Service para condominios`, 40, 822);

  return doc;
}

export function saveEsgPdf(state: EcoPlasticState) {
  const doc = buildEsgDoc(state);
  const filename = `ESG_${state.condominio.nome.replace(/\W+/g, '_')}_${new Date().toISOString().slice(0, 7)}.pdf`;
  doc.save(filename);
}
