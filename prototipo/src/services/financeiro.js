import { getState } from '../core/store.js';
import { totaisMensais, receitaMes } from './coletas.js';

export function simulate(unidades, engajamentoPct) {
  // Aproximação: cada morador ativo gera ~0.4 kg/mês * preço cooperativa.
  const cfg = getState().configPontos;
  const coop = getState().cooperativa.lista.find(c => c.id === getState().cooperativa.atualId);
  const ativos = Math.round(unidades * (engajamentoPct / 100));
  const kgMes = ativos * 5.8; // ~5.8 kg / morador ativo / mês (modelo)
  const receitaBruta = kgMes * (coop?.precoKg || 2.45);
  const recCondo = receitaBruta * cfg.splitCondominio;
  return {
    kgMes,
    receitaMensal: recCondo,
    receitaAnual: recCondo * 12
  };
}

export function saldoCondominio() {
  const cfg = getState().configPontos;
  return getState().coletas
    .filter(c => c.status === 'concluida')
    .reduce((s, c) => s + c.valorBruto * cfg.splitCondominio, 0);
}

export function acumuladoAno() {
  const cfg = getState().configPontos;
  const ano = new Date().getFullYear();
  return getState().coletas
    .filter(c => c.status === 'concluida' && new Date(c.data).getFullYear() === ano)
    .reduce((s, c) => s + c.valorBruto * cfg.splitCondominio, 0);
}

export function projecaoAnual() {
  const tots = totaisMensais();
  const validos = tots.filter(m => m.receita > 0);
  if (!validos.length) return 0;
  const media = validos.reduce((s, m) => s + m.receita, 0) / validos.length;
  const cfg = getState().configPontos;
  return media * 12 * cfg.splitCondominio;
}

export function variacaoMes() {
  const atual = receitaMes(0);
  const ant = receitaMes(1);
  if (!ant) return { abs: atual, pct: 0 };
  return { abs: atual - ant, pct: ((atual - ant) / ant) * 100 };
}
