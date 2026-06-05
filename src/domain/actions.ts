import { BRAND } from './brand';
import { parseLocalDate } from './format';
import type { AuditActor, EcoPlasticState } from './types';

let runtimeCounter = 10_000;

export const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${(runtimeCounter += 1).toString(36)}`;

function clone(state: EcoPlasticState): EcoPlasticState {
  return structuredClone(state);
}

function audit(state: EcoPlasticState, actor: AuditActor, action: string, summary: string) {
  state.auditLog.unshift({
    id: uid('audit'),
    ts: Date.now(),
    actor,
    action,
    summary
  });
  state.auditLog = state.auditLog.slice(0, 80);
}

export function setPersona(state: EcoPlasticState, persona: EcoPlasticState['persona'], moradorId: string | null = null) {
  const next = clone(state);
  next.persona = persona;
  next.currentMoradorId = moradorId;
  audit(next, persona === 'morador' ? 'morador' : 'sindico', 'session.persona', persona ? `Entrada como ${persona}` : 'Logout');
  return next;
}

export function depositarPET(state: EcoPlasticState, input: { moradorId: string; kg: number }) {
  if (input.kg <= 0 || input.kg > 5) throw new Error('Peso invalido para demonstracao');
  const next = clone(state);
  const morador = next.moradores.find((item) => item.id === input.moradorId);
  if (!morador) throw new Error('Morador nao encontrado');
  const pontos = Math.round(input.kg * next.configPontos.pontosPorKg);
  const transacao = {
    id: uid('t'),
    tipo: 'deposito' as const,
    moradorId: input.moradorId,
    kg: Number(input.kg.toFixed(2)),
    pontos,
    ts: Date.now()
  };
  next.transacoes.unshift(transacao);
  morador.pontos += pontos;
  morador.kgTotal = Number((morador.kgTotal + input.kg).toFixed(2));
  morador.ativo = true;
  next.maquina.ocupadoKg = Math.min(next.maquina.capacidadeKg, Number((next.maquina.ocupadoKg + input.kg).toFixed(2)));
  audit(next, 'morador', 'deposito.created', `${morador.nome} descartou ${input.kg.toFixed(1)} kg de PET`);
  return { state: next, transacao };
}

export function resgatarRecompensa(state: EcoPlasticState, input: { moradorId: string; recompensaId: string }) {
  const next = clone(state);
  const morador = next.moradores.find((item) => item.id === input.moradorId);
  const recompensa = next.recompensas.find((item) => item.id === input.recompensaId);
  if (!morador || !recompensa) throw new Error('Resgate invalido');
  if (morador.pontos < recompensa.custoPontos) throw new Error('Pontos insuficientes');
  if (recompensa.estoque <= 0) throw new Error('Recompensa sem estoque');

  morador.pontos -= recompensa.custoPontos;
  recompensa.estoque -= 1;
  const transacao = {
    id: uid('t'),
    tipo: 'resgate' as const,
    moradorId: input.moradorId,
    recompensaId: input.recompensaId,
    pontos: -recompensa.custoPontos,
    valor: 0,
    ts: Date.now()
  };
  next.transacoes.unshift(transacao);
  audit(next, 'morador', 'recompensa.redeemed', `${morador.nome} resgatou ${recompensa.titulo}`);
  return { state: next, transacao };
}

export function solicitarColeta(state: EcoPlasticState, input: { data: string; observacao?: string }) {
  const next = clone(state);
  const data = parseLocalDate(input.data);
  if (data.getTime() < Date.now() - 86_400_000) throw new Error('A coleta precisa estar em data futura');
  const coleta = {
    id: uid('c'),
    data: data.getTime(),
    status: 'pendente' as const,
    pesoKg: 0,
    valorBruto: 0,
    cooperativaId: next.cooperativa.atualId,
    observacao: input.observacao?.trim() || undefined
  };
  next.coletas.push(coleta);
  audit(next, 'sindico', 'coleta.requested', `Coleta avulsa solicitada para ${input.data}`);
  return { state: next, coleta };
}

export function reagendarColeta(state: EcoPlasticState, coletaId: string, novaData: string) {
  const next = clone(state);
  const coleta = next.coletas.find((item) => item.id === coletaId);
  if (!coleta) throw new Error('Coleta nao encontrada');
  if (coleta.status === 'cancelada' || coleta.status === 'concluida') throw new Error('Coleta nao pode ser reagendada');
  coleta.data = parseLocalDate(novaData).getTime();
  audit(next, 'sindico', 'coleta.rescheduled', `Coleta reagendada para ${novaData}`);
  return next;
}

export function cancelarColeta(state: EcoPlasticState, coletaId: string) {
  const next = clone(state);
  const coleta = next.coletas.find((item) => item.id === coletaId);
  if (!coleta) throw new Error('Coleta nao encontrada');
  if (coleta.status === 'concluida') throw new Error('Coleta concluida nao pode ser cancelada');
  coleta.status = 'cancelada';
  audit(next, 'sindico', 'coleta.cancelled', 'Coleta cancelada');
  return next;
}

export function trocarCooperativa(state: EcoPlasticState, cooperativaId: string) {
  const next = clone(state);
  const cooperativa = next.cooperativa.lista.find((item) => item.id === cooperativaId);
  if (!cooperativa) throw new Error('Cooperativa nao encontrada');
  next.cooperativa.atualId = cooperativaId;
  audit(next, 'sindico', 'cooperativa.changed', `Cooperativa atualizada para ${cooperativa.nome}`);
  return next;
}

export function convidarMoradores(state: EcoPlasticState, rows: Array<{ email: string; apto: string }>) {
  if (!rows.length) throw new Error('Informe ao menos um morador');
  const next = clone(state);
  const aptosExistentes = new Set(next.moradores.map((morador) => morador.apto));
  const convites = rows.map((row) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) throw new Error(`E-mail invalido: ${row.email}`);
    if (!/^[\w\d-]{1,8}$/i.test(row.apto)) throw new Error(`Apto invalido: ${row.apto}`);
    if (aptosExistentes.has(row.apto)) throw new Error(`Apto ${row.apto} ja cadastrado`);
    return {
      id: uid('cv'),
      email: row.email.trim().toLowerCase(),
      apto: row.apto.trim(),
      status: 'pendente' as const,
      criadoEm: Date.now()
    };
  });
  next.convites.push(...convites);
  audit(next, 'sindico', 'morador.invited', `${convites.length} convite(s) enviado(s)`);
  return { state: next, convites };
}

export function resetarDemo(seed: EcoPlasticState) {
  const next = clone(seed);
  audit(next, 'sindico', 'demo.reset', `Demo ${BRAND.name} resetada`);
  return next;
}
