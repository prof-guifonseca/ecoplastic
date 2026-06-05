import { z } from 'zod';
import { BRAND } from './brand';

// Schemas zod espelhando src/domain/types.ts. Validam a fronteira de entrada
// (localStorage / import JSON / sync entre abas): dados corrompidos ou adulterados
// degradam com seguranca para o seed determinístico.

const condominioSchema = z.object({
  id: z.string(),
  nome: z.string(),
  unidades: z.number(),
  endereco: z.string()
});

const maquinaSchema = z.object({
  id: z.string(),
  capacidadeKg: z.number(),
  ocupadoKg: z.number(),
  ultimaColeta: z.number()
});

const cooperativaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  precoKg: z.number(),
  distanciaKm: z.number()
});

const moradorSchema = z.object({
  id: z.string(),
  nome: z.string(),
  apto: z.string(),
  email: z.string(),
  pontos: z.number(),
  kgTotal: z.number(),
  ativo: z.boolean(),
  criadoEm: z.number()
});

const conviteSchema = z.object({
  id: z.string(),
  email: z.string(),
  apto: z.string(),
  status: z.enum(['pendente', 'aceito']),
  criadoEm: z.number()
});

const coletaSchema = z.object({
  id: z.string(),
  data: z.number(),
  status: z.enum(['agendada', 'concluida', 'pendente', 'cancelada']),
  pesoKg: z.number(),
  valorBruto: z.number(),
  cooperativaId: z.string(),
  observacao: z.string().optional()
});

const transacaoSchema = z.object({
  id: z.string(),
  tipo: z.enum(['deposito', 'resgate', 'bonus']),
  moradorId: z.string(),
  kg: z.number().optional(),
  pontos: z.number(),
  valor: z.number().optional(),
  recompensaId: z.string().optional(),
  ts: z.number()
});

const recompensaSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  ico: z.string(),
  custoPontos: z.number(),
  parceiro: z.string(),
  estoque: z.number()
});

const configPontosSchema = z.object({
  pontosPorKg: z.number(),
  pontosPorGarrafa: z.number(),
  valorReaisPorPonto: z.number(),
  splitCondominio: z.number()
});

const auditEventSchema = z.object({
  id: z.string(),
  ts: z.number(),
  actor: z.enum(['sistema', 'sindico', 'morador', 'migracao']),
  action: z.string(),
  summary: z.string()
});

export const ecoPlasticStateSchema = z.object({
  schemaVersion: z.literal(BRAND.schemaVersion),
  persona: z.enum(['sindico', 'morador']).nullable(),
  currentMoradorId: z.string().nullable(),
  condominio: condominioSchema,
  maquina: maquinaSchema,
  cooperativa: z.object({ atualId: z.string(), lista: z.array(cooperativaSchema) }),
  configPontos: configPontosSchema,
  moradores: z.array(moradorSchema),
  convites: z.array(conviteSchema),
  coletas: z.array(coletaSchema),
  transacoes: z.array(transacaoSchema),
  recompensas: z.array(recompensaSchema),
  auditLog: z.array(auditEventSchema)
});

export const importEnvelopeSchema = z.object({
  app: z.literal(BRAND.name),
  exportedAt: z.string(),
  state: ecoPlasticStateSchema
});
