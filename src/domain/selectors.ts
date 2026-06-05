import type { Coleta, EcoPlasticState, Morador } from './types';

export function cooperativaAtual(state: EcoPlasticState) {
  return state.cooperativa.lista.find((coop) => coop.id === state.cooperativa.atualId) ?? null;
}

export function listarColetas(state: EcoPlasticState) {
  return [...state.coletas].sort((a, b) => b.data - a.data);
}

export function proximaAgendada(state: EcoPlasticState) {
  return state.coletas
    .filter((coleta) => coleta.status === 'agendada' && coleta.data >= Date.now() - 86_400_000)
    .sort((a, b) => a.data - b.data)[0] ?? null;
}

export function transacoesDoMorador(state: EcoPlasticState, moradorId?: string | null) {
  return state.transacoes
    .filter((transacao) => !moradorId || transacao.moradorId === moradorId)
    .slice()
    .sort((a, b) => b.ts - a.ts);
}

export function ranking(state: EcoPlasticState, limit = 10) {
  return state.moradores
    .filter((morador) => morador.ativo)
    .slice()
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limit);
}

export function posicaoDe(state: EcoPlasticState, moradorId: string) {
  const lista = ranking(state, state.moradores.length);
  const index = lista.findIndex((morador) => morador.id === moradorId);
  return index >= 0 ? index + 1 : lista.length + 1;
}

export function totalCadastrados(state: EcoPlasticState) {
  return state.moradores.length + state.convites.filter((convite) => convite.status === 'pendente').length;
}

export function totalAtivosMes(state: EcoPlasticState) {
  const inicio = new Date();
  inicio.setDate(1);
  inicio.setHours(0, 0, 0, 0);
  const ativos = new Set<string>();
  for (const transacao of state.transacoes) {
    if (transacao.tipo === 'deposito' && transacao.ts >= inicio.getTime()) {
      ativos.add(transacao.moradorId);
    }
  }
  return ativos.size;
}

export function pontosDistribuidosMes(state: EcoPlasticState) {
  const inicio = new Date();
  inicio.setDate(1);
  inicio.setHours(0, 0, 0, 0);
  return state.transacoes
    .filter((transacao) => transacao.ts >= inicio.getTime() && transacao.pontos > 0)
    .reduce((sum, transacao) => sum + transacao.pontos, 0);
}

export function totaisMensais(state: EcoPlasticState) {
  const map = new Map<string, { label: Date; kg: number; receita: number }>();
  const hoje = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    map.set(`${date.getFullYear()}-${date.getMonth()}`, { label: date, kg: 0, receita: 0 });
  }
  for (const coleta of state.coletas) {
    if (coleta.status !== 'concluida') continue;
    const date = new Date(coleta.data);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const entry = map.get(key);
    if (!entry) continue;
    entry.kg += coleta.pesoKg;
    entry.receita += coleta.valorBruto;
  }
  return Array.from(map.values());
}

function inMonth(coleta: Coleta, monthOffset: number) {
  const hoje = new Date();
  const target = new Date(hoje.getFullYear(), hoje.getMonth() - monthOffset, 1);
  const data = new Date(coleta.data);
  return data.getMonth() === target.getMonth() && data.getFullYear() === target.getFullYear();
}

export function totalKgMes(state: EcoPlasticState, monthOffset = 0) {
  return state.coletas
    .filter((coleta) => coleta.status === 'concluida' && inMonth(coleta, monthOffset))
    .reduce((sum, coleta) => sum + coleta.pesoKg, 0);
}

export function receitaMes(state: EcoPlasticState, monthOffset = 0) {
  return state.coletas
    .filter((coleta) => coleta.status === 'concluida' && inMonth(coleta, monthOffset))
    .reduce((sum, coleta) => sum + coleta.valorBruto, 0);
}

export function variacaoMes(state: EcoPlasticState) {
  const atual = receitaMes(state, 0);
  const anterior = receitaMes(state, 1);
  if (!anterior) return { abs: atual, pct: 0 };
  return { abs: atual - anterior, pct: ((atual - anterior) / anterior) * 100 };
}

export function saldoCondominio(state: EcoPlasticState) {
  return state.coletas
    .filter((coleta) => coleta.status === 'concluida')
    .reduce((sum, coleta) => sum + coleta.valorBruto * state.configPontos.splitCondominio, 0);
}

export function acumuladoAno(state: EcoPlasticState) {
  const ano = new Date().getFullYear();
  return state.coletas
    .filter((coleta) => coleta.status === 'concluida' && new Date(coleta.data).getFullYear() === ano)
    .reduce((sum, coleta) => sum + coleta.valorBruto * state.configPontos.splitCondominio, 0);
}

export function projecaoAnual(state: EcoPlasticState) {
  const meses = totaisMensais(state).filter((mes) => mes.receita > 0);
  if (!meses.length) return 0;
  const media = meses.reduce((sum, mes) => sum + mes.receita, 0) / meses.length;
  return media * 12 * state.configPontos.splitCondominio;
}

export function simulateFinanceiro(state: EcoPlasticState, unidades: number, engajamentoPct: number) {
  const coop = cooperativaAtual(state);
  const ativos = Math.round(unidades * (engajamentoPct / 100));
  const kgMes = ativos * 5.8;
  const receitaBruta = kgMes * (coop?.precoKg ?? 2.45);
  const receitaMensal = receitaBruta * state.configPontos.splitCondominio;
  return { kgMes, receitaMensal, receitaAnual: receitaMensal * 12 };
}

export function metricasEsg(state: EcoPlasticState) {
  const kg = state.coletas
    .filter((coleta) => coleta.status === 'concluida')
    .reduce((sum, coleta) => sum + coleta.pesoKg, 0);

  return {
    kg,
    garrafas: Math.round(kg * 30),
    co2Toneladas: Number((kg * 0.0027).toFixed(2)),
    arvores: Math.round(kg * 0.045),
    aguaLitros: Math.round(kg * 10),
    energiaKwh: Math.round(kg * 5.4)
  };
}

export function moradorAtual(state: EcoPlasticState): Morador | null {
  if (!state.currentMoradorId) return null;
  return state.moradores.find((morador) => morador.id === state.currentMoradorId) ?? null;
}
