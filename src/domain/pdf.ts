import { jsPDF } from 'jspdf';
import { BRAND } from './brand';
import { brl, dec, num } from './format';
import { metricasEsg, totaisMensais } from './selectors';
import type { EcoPlasticState } from './types';

export function saveEsgPdf(state: EcoPlasticState) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const metrics = metricasEsg(state);
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(54, 209, 127);
  doc.rect(0, 0, width, 72, 'F');
  doc.setTextColor(4, 20, 11);
  doc.setFontSize(20);
  doc.text(`Relatorio ESG - ${BRAND.name}`, 40, 34);
  doc.setFontSize(11);
  doc.text(state.condominio.nome, 40, 54);

  doc.setTextColor(36, 50, 50);
  doc.setFontSize(13);
  doc.text(`Periodo acumulado - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`, 40, 102);
  doc.setFontSize(10);
  doc.setTextColor(90, 105, 104);
  doc.text(state.condominio.endereco, 40, 118);

  const kpis = [
    { label: 'Plastico reciclado', value: `${dec(metrics.kg)} kg` },
    { label: 'Garrafas PET', value: num(metrics.garrafas) },
    { label: 'CO2 evitado', value: `${metrics.co2Toneladas} t` }
  ];

  for (const [index, kpi] of kpis.entries()) {
    const x = 40 + index * 175;
    doc.setDrawColor(210, 222, 220);
    doc.setFillColor(245, 250, 248);
    doc.roundedRect(x, 150, 165, 70, 8, 8, 'FD');
    doc.setTextColor(90, 105, 104);
    doc.setFontSize(9);
    doc.text(kpi.label.toUpperCase(), x + 12, 172);
    doc.setTextColor(30, 159, 90);
    doc.setFontSize(18);
    doc.text(kpi.value, x + 12, 200);
  }

  let y = 252;
  doc.setTextColor(36, 50, 50);
  doc.setFontSize(13);
  doc.text('Equivalencias ambientais', 40, y);
  y += 22;
  doc.setFontSize(11);
  doc.setTextColor(60, 70, 70);
  [
    `${metrics.arvores} arvores preservadas`,
    `${num(metrics.aguaLitros)} litros de agua economizados`,
    `${num(metrics.energiaKwh)} kWh de energia poupados`,
    `${num(metrics.garrafas)} garrafas PET fora do aterro`
  ].forEach((line) => {
    doc.text(line, 40, y);
    y += 17;
  });

  y += 18;
  doc.setFontSize(13);
  doc.setTextColor(36, 50, 50);
  doc.text('Evolucao mensal', 40, y);
  y += 18;
  doc.setFontSize(10);
  doc.setTextColor(90, 105, 104);
  doc.text('Mes', 40, y);
  doc.text('Kg coletados', 220, y);
  doc.text('Receita', 380, y);
  y += 8;
  doc.line(40, y, width - 40, y);
  y += 16;
  for (const item of totaisMensais(state)) {
    doc.setTextColor(36, 50, 50);
    doc.text(item.label.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }), 40, y);
    doc.text(`${dec(item.kg)} kg`, 220, y);
    doc.text(brl(item.receita), 380, y);
    y += 17;
  }

  doc.setFontSize(9);
  doc.setTextColor(145, 145, 145);
  doc.text(`Gerado por ${BRAND.name} - plataforma Recycle-as-a-Service para condominios`, 40, 820);

  const filename = `ESG_${state.condominio.nome.replace(/\W+/g, '_')}_${new Date().toISOString().slice(0, 7)}.pdf`;
  doc.save(filename);
}
