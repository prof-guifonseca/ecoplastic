import { BRAND } from './brand';
import { mulberry32 } from '../content/rng';
import { capacidadeMaquinaKg, condominio, configPontos, cooperativas, recompensas } from '../content/scenarios/jardim-palmeiras';
import type { Cooperativa, EcoPlasticState, Morador } from './types';

const NOMES = [
  'Julia Ramos', 'Marcos Vieira', 'Fernanda Castro', 'Ricardo Almeida', 'Patricia Souza',
  'Bruno Oliveira', 'Camila Pereira', 'Lucas Martins', 'Beatriz Costa', 'Andre Lima',
  'Mariana Silva', 'Thiago Santos', 'Larissa Barbosa', 'Felipe Carvalho', 'Aline Rocha',
  'Diego Mendes', 'Sofia Cardoso', 'Pedro Henrique', 'Isabela Nunes', 'Rafael Gomes',
  'Carolina Dias', 'Vinicius Freitas', 'Helena Pinto', 'Gabriel Moreira', 'Leticia Ribeiro',
  'Eduardo Teixeira', 'Vanessa Cunha', 'Gustavo Pires', 'Renata Macedo', 'Henrique Borges',
  'Tatiana Reis', 'Murilo Antunes', 'Bianca Faria', 'Rodrigo Tavares', 'Priscila Lopes',
  'Fabio Coelho', 'Daniela Cruz', 'Leonardo Aguiar', 'Natalia Caldeira', 'Vitor Marques',
  'Claudia Barros', 'Igor Vasconcelos', 'Amanda Brito', 'Thiago Galvao', 'Roberta Siqueira'
];

const SOBRENOMES_EXTRA = ['Junior', 'Filho', 'Neto', 'Sobrinho'];

const id = (prefix: string, index: number) => `${prefix}_${String(index).padStart(4, '0')}`;

function score(index: number, min: number, span: number) {
  // PRNG semeado pelo indice (mulberry32): deterministico e bem distribuido, sem o padrao do sine-hash.
  const draw = mulberry32(Math.imul(index, 0x9e3779b1) >>> 0)();
  return min + draw * span;
}

function gerarMoradores(now: number): Morador[] {
  const moradores: Morador[] = [];
  let index = 0;

  for (let andar = 1; andar <= 21; andar += 1) {
    for (let unidade = 1; unidade <= 4; unidade += 1) {
      if (moradores.length >= 68) continue;
      const apto = `${andar}${String(unidade).padStart(2, '0')}`;
      const nomeBase = NOMES[index % NOMES.length];
      const nome = index >= NOMES.length
        ? `${nomeBase} ${SOBRENOMES_EXTRA[index % SOBRENOMES_EXTRA.length]}`
        : nomeBase;
      const kgTotal = Number(score(index + 1, 1.2, 19.4).toFixed(1));
      const pontos = Math.round(kgTotal * 30 + score(index + 20, 40, 220));
      const ativo = index % 11 !== 0;
      moradores.push({
        id: id('m', index + 1),
        nome,
        apto,
        email: `${nome.toLowerCase().split(' ')[0]}.${apto}@condo.com`,
        pontos,
        kgTotal,
        ativo,
        criadoEm: now - (30 + index * 2) * 86_400_000
      });
      index += 1;
    }
  }

  const julia = moradores.find((morador) => morador.nome.startsWith('Julia'));
  if (julia) {
    // Moradora-destaque (#1 do ranking) com pontos coerentes: kgTotal * pontosPorKg (30)
    // mais um bonus de engajamento dentro da faixa dos demais moradores.
    julia.apto = '1204';
    julia.email = `${julia.nome.toLowerCase().split(' ')[0]}.${julia.apto}@condo.com`;
    julia.kgTotal = 64;
    julia.pontos = Math.round(julia.kgTotal * 30) + 240;
    julia.ativo = true;
  }

  return moradores;
}

function gerarColetas(coopId: string, cooperativas: Cooperativa[], now: number) {
  const hoje = new Date(now);
  const coletas = [];
  for (let i = 5; i >= 1; i -= 1) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 12 + i, 14, 0, 0, 0);
    const pesoKg = 420 + i * 21;
    const precoKg = cooperativas[i % cooperativas.length].precoKg;
    coletas.push({
      id: id('c', 6 - i),
      data: data.getTime(),
      status: 'concluida' as const,
      pesoKg,
      valorBruto: Number((pesoKg * precoKg).toFixed(2)),
      cooperativaId: coopId
    });
  }

  const diaAtual = Math.max(1, hoje.getDate() - 3);
  const atual = new Date(hoje.getFullYear(), hoje.getMonth(), diaAtual, 14, 0, 0, 0);
  const pesoAtual = 512;
  coletas.push({
    id: id('c', 6),
    data: atual.getTime(),
    status: 'concluida' as const,
    pesoKg: pesoAtual,
    valorBruto: Number((pesoAtual * cooperativas[0].precoKg).toFixed(2)),
    cooperativaId: coopId
  });

  const prox = new Date(now + 2 * 86_400_000);
  prox.setHours(14, 0, 0, 0);
  coletas.push({
    id: id('c', 7),
    data: prox.getTime(),
    status: 'agendada' as const,
    pesoKg: 0,
    valorBruto: 0,
    cooperativaId: coopId
  });

  return coletas;
}

function gerarTransacoes(moradores: Morador[], now: number) {
  const transacoes = [];
  let counter = 1;
  for (const [index, morador] of moradores.entries()) {
    if (!morador.ativo) continue;
    const total = (index % 7) + 2;
    for (let i = 0; i < total; i += 1) {
      const kg = Number((0.18 + ((index + i) % 8) * 0.09).toFixed(2));
      transacoes.push({
        id: id('t', counter),
        tipo: 'deposito' as const,
        moradorId: morador.id,
        kg,
        pontos: Math.round(kg * 30),
        ts: now - (i + index) * 7_200_000
      });
      counter += 1;
    }
  }
  return transacoes.sort((a, b) => b.ts - a.ts);
}

export function buildSeed(now = Date.now()): EcoPlasticState {
  const moradores = gerarMoradores(now);
  const coletas = gerarColetas(cooperativas[0].id, cooperativas, now);
  const transacoes = gerarTransacoes(moradores, now);

  // Estado da maquina derivado dos dados (nao hardcoded): a ultima coleta concluida
  // esvaziou o compactador, e a ocupacao atual e a soma dos depositos desde entao.
  const capacidadeKg = capacidadeMaquinaKg;
  const ultimaColeta = coletas
    .filter((coleta) => coleta.status === 'concluida')
    .reduce((max, coleta) => Math.max(max, coleta.data), 0);
  const ocupadoKg = Number(
    Math.min(
      capacidadeKg,
      transacoes
        .filter((transacao) => transacao.tipo === 'deposito' && transacao.ts >= ultimaColeta)
        .reduce((sum, transacao) => sum + (transacao.kg ?? 0), 0)
    ).toFixed(1)
  );

  return {
    schemaVersion: BRAND.schemaVersion,
    persona: null,
    currentMoradorId: null,
    condominio,
    maquina: {
      id: 'maq_001',
      capacidadeKg,
      ocupadoKg,
      ultimaColeta
    },
    cooperativa: { atualId: cooperativas[0].id, lista: cooperativas },
    configPontos,
    moradores,
    convites: [],
    coletas,
    transacoes,
    recompensas,
    auditLog: [
      {
        id: id('audit', 1),
        ts: now,
        actor: 'sistema',
        action: 'seed.created',
        summary: `Dados demonstrativos ${BRAND.name} inicializados`
      }
    ]
  };
}
