import { BRAND } from './brand';
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
  const x = Math.sin(index * 12.9898) * 43758.5453;
  return min + (x - Math.floor(x)) * span;
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
    julia.apto = '1204';
    julia.pontos = 3420;
    julia.kgTotal = 13.6;
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
  const cooperativas: Cooperativa[] = [
    { id: 'coop_recicla_sp', nome: 'Recicla SP', precoKg: 2.48, distanciaKm: 4.2 },
    { id: 'coop_coopamare', nome: 'Coopamare', precoKg: 2.32, distanciaKm: 6.1 },
    { id: 'coop_verde_vivo', nome: 'Verde Vivo Cooperativa', precoKg: 2.55, distanciaKm: 8.7 },
    { id: 'coop_renova', nome: 'Renova Brasil', precoKg: 2.4, distanciaKm: 5.3 }
  ];
  const moradores = gerarMoradores(now);
  const coletas = gerarColetas('coop_recicla_sp', cooperativas, now);

  return {
    schemaVersion: BRAND.schemaVersion,
    persona: null,
    currentMoradorId: null,
    condominio: {
      id: 'cond_jardim_palmeiras',
      nome: 'Edificio Jardim das Palmeiras',
      unidades: 84,
      endereco: 'R. das Palmeiras, 1240 - Vila Mariana, Sao Paulo/SP'
    },
    maquina: {
      id: 'maq_001',
      capacidadeKg: 250,
      ocupadoKg: 168,
      ultimaColeta: now - 12 * 86_400_000
    },
    cooperativa: { atualId: 'coop_recicla_sp', lista: cooperativas },
    configPontos: {
      pontosPorKg: 30,
      pontosPorGarrafa: 10,
      valorReaisPorPonto: 0.005,
      splitCondominio: 0.7
    },
    moradores,
    convites: [],
    coletas,
    transacoes: gerarTransacoes(moradores, now),
    recompensas: [
      { id: 'r_desc_10', titulo: 'R$ 10 desconto no boleto', descricao: 'Aplicado no proximo condominio', ico: '💰', custoPontos: 2000, parceiro: 'Condominio', estoque: 50 },
      { id: 'r_desc_25', titulo: 'R$ 25 desconto no boleto', descricao: 'Aplicado no proximo condominio', ico: '💰', custoPontos: 5000, parceiro: 'Condominio', estoque: 30 },
      { id: 'r_arvore', titulo: 'Adocao de 1 arvore', descricao: 'Plantio em parceria SOS Mata Atlantica', ico: '🌳', custoPontos: 3500, parceiro: 'SOS Mata Atlantica', estoque: 20 },
      { id: 'r_sacola', titulo: `Sacola eco ${BRAND.name}`, descricao: 'Entrega na portaria', ico: '🛍️', custoPontos: 1200, parceiro: BRAND.name, estoque: 40 },
      { id: 'r_cinema', titulo: '2 ingressos Cinemark', descricao: 'Voucher digital', ico: '🎬', custoPontos: 4500, parceiro: 'Cinemark', estoque: 15 },
      { id: 'r_ifood', titulo: 'R$ 30 iFood', descricao: 'Voucher digital', ico: '🍔', custoPontos: 6000, parceiro: 'iFood', estoque: 10 }
    ],
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
