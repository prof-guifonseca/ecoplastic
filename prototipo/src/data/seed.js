import { uid } from '../core/id.js';

export const SCHEMA_VERSION = 1;

const NOMES = [
  'Julia Ramos', 'Marcos Vieira', 'Fernanda Castro', 'Ricardo Almeida', 'Patricia Souza',
  'Bruno Oliveira', 'Camila Pereira', 'Lucas Martins', 'Beatriz Costa', 'André Lima',
  'Mariana Silva', 'Thiago Santos', 'Larissa Barbosa', 'Felipe Carvalho', 'Aline Rocha',
  'Diego Mendes', 'Sofia Cardoso', 'Pedro Henrique', 'Isabela Nunes', 'Rafael Gomes',
  'Carolina Dias', 'Vinicius Freitas', 'Helena Pinto', 'Gabriel Moreira', 'Letícia Ribeiro',
  'Eduardo Teixeira', 'Vanessa Cunha', 'Gustavo Pires', 'Renata Macedo', 'Henrique Borges',
  'Tatiana Reis', 'Murilo Antunes', 'Bianca Faria', 'Rodrigo Tavares', 'Priscila Lopes',
  'Fábio Coelho', 'Daniela Cruz', 'Leonardo Aguiar', 'Natália Caldeira', 'Vitor Marques',
  'Cláudia Barros', 'Igor Vasconcelos', 'Amanda Brito', 'Thiago Galvão', 'Roberta Siqueira'
];

const SOBRENOMES_EXTRA = ['Junior', 'Filho', 'Neto', 'Sobrinho'];

function gerarMoradores() {
  const moradores = [];
  let usedAptos = new Set();
  // Andar 1-21, apartamentos 01-04 -> até 84 unidades
  for (let andar = 1; andar <= 21; andar++) {
    for (let unit = 1; unit <= 4; unit++) {
      const apto = `${andar}${String(unit).padStart(2, '0')}`;
      if (usedAptos.has(apto)) continue;
      usedAptos.add(apto);
      // 81% de adesão (68 cadastrados de 84)
      if (moradores.length >= 68) continue;
      const nome = NOMES[moradores.length % NOMES.length] +
        (moradores.length >= NOMES.length ? ' ' + SOBRENOMES_EXTRA[moradores.length % SOBRENOMES_EXTRA.length] : '');
      const ativo = Math.random() > 0.09;
      const kgTotal = +(Math.random() * 18 + 0.5).toFixed(1);
      const pontos = Math.round(kgTotal * 30 + Math.random() * 200);
      moradores.push({
        id: uid('m'),
        nome,
        apto,
        email: nome.toLowerCase().split(' ')[0] + '.' + apto + '@condo.com',
        pontos,
        kgTotal,
        ativo,
        criadoEm: Date.now() - (Math.random() * 180 * 86400000)
      });
    }
  }
  // Garante Julia em 1204
  const julia = moradores.find(m => m.nome.startsWith('Julia'));
  if (julia) { julia.apto = '1204'; julia.pontos = 3420; julia.kgTotal = 13.6; julia.ativo = true; }
  return moradores;
}

function gerarColetas(coopId) {
  const coletas = [];
  const hoje = new Date();
  // Last 6 months (i=5..1) — full-month volume; current month (i=0) — recent partial
  for (let i = 5; i >= 1; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 12 + Math.floor(Math.random() * 8));
    const peso = +(420 + Math.random() * 150).toFixed(0);
    const preco = 2.4 + Math.random() * 0.3;
    coletas.push({
      id: uid('c'),
      data: d.getTime(),
      status: 'concluida',
      pesoKg: peso,
      valorBruto: +(peso * preco).toFixed(2),
      cooperativaId: coopId
    });
  }
  // Current month: a recent completed pickup, dated a few days ago (or 1st of month if early)
  const diaAtual = hoje.getDate();
  const diaColetaAtual = Math.max(1, diaAtual - 3);
  const dAtual = new Date(hoje.getFullYear(), hoje.getMonth(), diaColetaAtual);
  const pesoAtual = +(490 + Math.random() * 120).toFixed(0); // tendência crescente
  const precoAtual = 2.45 + Math.random() * 0.2;
  coletas.push({
    id: uid('c'),
    data: dAtual.getTime(),
    status: 'concluida',
    pesoKg: pesoAtual,
    valorBruto: +(pesoAtual * precoAtual).toFixed(2),
    cooperativaId: coopId
  });
  // Próxima coleta agendada (2 dias à frente)
  const prox = new Date(hoje.getTime() + 2 * 86400000);
  prox.setHours(14, 0, 0, 0);
  coletas.push({
    id: uid('c'),
    data: prox.getTime(),
    status: 'agendada',
    pesoKg: 0,
    valorBruto: 0,
    cooperativaId: coopId
  });
  return coletas;
}

function gerarTransacoes(moradores) {
  const trans = [];
  const hoje = Date.now();
  moradores.forEach(m => {
    if (!m.ativo) return;
    const n = Math.floor(Math.random() * 8) + 1;
    for (let i = 0; i < n; i++) {
      const ts = hoje - Math.random() * 30 * 86400000;
      const kg = +(Math.random() * 0.8 + 0.1).toFixed(2);
      trans.push({
        id: uid('t'),
        tipo: 'deposito',
        moradorId: m.id,
        kg,
        pontos: Math.round(kg * 30),
        ts
      });
    }
  });
  return trans.sort((a, b) => b.ts - a.ts);
}

export function buildSeed() {
  const cooperativas = [
    { id: 'coop_recicla_sp', nome: 'Recicla SP', precoKg: 2.48, distanciaKm: 4.2 },
    { id: 'coop_coopamare', nome: 'Coopamare', precoKg: 2.32, distanciaKm: 6.1 },
    { id: 'coop_verde_vivo', nome: 'Verde Vivo Cooperativa', precoKg: 2.55, distanciaKm: 8.7 },
    { id: 'coop_renova', nome: 'Renova Brasil', precoKg: 2.40, distanciaKm: 5.3 }
  ];
  const moradores = gerarMoradores();
  const coletas = gerarColetas('coop_recicla_sp');
  const transacoes = gerarTransacoes(moradores);

  return {
    schemaVersion: SCHEMA_VERSION,
    persona: null,
    currentMoradorId: null,
    condominio: {
      id: 'cond_jardim_palmeiras',
      nome: 'Edifício Jardim das Palmeiras',
      unidades: 84,
      endereco: 'R. das Palmeiras, 1240 — Vila Mariana, São Paulo/SP'
    },
    maquina: {
      id: 'maq_001',
      capacidadeKg: 250,
      ocupadoKg: 168,
      ultimaColeta: Date.now() - 12 * 86400000
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
    transacoes,
    recompensas: [
      { id: 'r_desc_10', titulo: 'R$ 10 desconto no boleto', descricao: 'Aplicado no próximo condomínio', ico: '💰', custoPontos: 2000, parceiro: 'Condomínio', estoque: 50 },
      { id: 'r_desc_25', titulo: 'R$ 25 desconto no boleto', descricao: 'Aplicado no próximo condomínio', ico: '💰', custoPontos: 5000, parceiro: 'Condomínio', estoque: 30 },
      { id: 'r_arvore', titulo: 'Adoção de 1 árvore', descricao: 'Plantio em parceria SOS Mata Atlântica', ico: '🌳', custoPontos: 3500, parceiro: 'SOS Mata Atlântica', estoque: 20 },
      { id: 'r_sacola', titulo: 'Sacola eco EcoTech', descricao: 'Entrega na portaria', ico: '🛍️', custoPontos: 1200, parceiro: 'EcoTech', estoque: 40 },
      { id: 'r_cinema', titulo: '2 ingressos Cinemark', descricao: 'Voucher digital', ico: '🎬', custoPontos: 4500, parceiro: 'Cinemark', estoque: 15 },
      { id: 'r_ifood', titulo: 'R$ 30 iFood', descricao: 'Voucher digital', ico: '🍔', custoPontos: 6000, parceiro: 'iFood', estoque: 10 }
    ]
  };
}
