export type Persona = 'sindico' | 'morador' | null;
export type ColetaStatus = 'agendada' | 'concluida' | 'pendente' | 'cancelada';
export type TransacaoTipo = 'deposito' | 'resgate' | 'bonus';
export type ConviteStatus = 'pendente' | 'aceito';
export type AuditActor = 'sistema' | 'sindico' | 'morador' | 'migracao';

export interface Condominio {
  id: string;
  nome: string;
  unidades: number;
  endereco: string;
}

export interface Maquina {
  id: string;
  capacidadeKg: number;
  ocupadoKg: number;
  ultimaColeta: number;
}

export interface Cooperativa {
  id: string;
  nome: string;
  precoKg: number;
  distanciaKm: number;
}

export interface Morador {
  id: string;
  nome: string;
  apto: string;
  email: string;
  pontos: number;
  kgTotal: number;
  ativo: boolean;
  criadoEm: number;
}

export interface Convite {
  id: string;
  email: string;
  apto: string;
  status: ConviteStatus;
  criadoEm: number;
}

export interface Coleta {
  id: string;
  data: number;
  status: ColetaStatus;
  pesoKg: number;
  valorBruto: number;
  cooperativaId: string;
  observacao?: string;
}

export interface Transacao {
  id: string;
  tipo: TransacaoTipo;
  moradorId: string;
  kg?: number;
  pontos: number;
  valor?: number;
  recompensaId?: string;
  ts: number;
}

export interface Recompensa {
  id: string;
  titulo: string;
  descricao: string;
  ico: string;
  custoPontos: number;
  parceiro: string;
  estoque: number;
}

export interface ConfigPontos {
  pontosPorKg: number;
  pontosPorGarrafa: number;
  valorReaisPorPonto: number;
  splitCondominio: number;
}

export interface AuditEvent {
  id: string;
  ts: number;
  actor: AuditActor;
  action: string;
  summary: string;
}

export interface EcoPlasticState {
  schemaVersion: 2;
  persona: Persona;
  currentMoradorId: string | null;
  condominio: Condominio;
  maquina: Maquina;
  cooperativa: {
    atualId: string;
    lista: Cooperativa[];
  };
  configPontos: ConfigPontos;
  moradores: Morador[];
  convites: Convite[];
  coletas: Coleta[];
  transacoes: Transacao[];
  recompensas: Recompensa[];
  auditLog: AuditEvent[];
}

export interface ImportEnvelope {
  app: 'EcoPlastic';
  exportedAt: string;
  state: EcoPlasticState;
}
