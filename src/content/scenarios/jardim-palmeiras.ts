// Cenario de demonstracao do EcoPlastic (dados separados da logica do seed).
//
// PROVENIENCIA: nomes de moradores sao ficticios; o endereco e ilustrativo (nao
// e um condominio real); precos por kg das cooperativas estao dentro da faixa
// real praticada no Brasil (ver docs/metodologia-financeira.md). Tudo aqui sao
// DADOS DEMONSTRATIVOS.

import { BRAND } from '../../domain/brand';
import type { Condominio, ConfigPontos, Cooperativa, Recompensa } from '../../domain/types';

export const condominio: Condominio = {
  id: 'cond_jardim_palmeiras',
  nome: 'Edificio Jardim das Palmeiras',
  unidades: 84,
  endereco: 'R. das Palmeiras, 1240 - Vila Mariana, Sao Paulo/SP'
};

/** Capacidade do compactador (kg de PET compactado). */
export const capacidadeMaquinaKg = 250;

/** Cooperativas parceiras. Precos em R$/kg dentro da faixa regional (CEMPRE). */
export const cooperativas: Cooperativa[] = [
  { id: 'coop_recicla_sp', nome: 'Recicla SP', precoKg: 2.48, distanciaKm: 4.2 },
  { id: 'coop_coopamare', nome: 'Coopamare', precoKg: 2.32, distanciaKm: 6.1 },
  { id: 'coop_verde_vivo', nome: 'Verde Vivo Cooperativa', precoKg: 2.55, distanciaKm: 8.7 },
  { id: 'coop_renova', nome: 'Renova Brasil', precoKg: 2.4, distanciaKm: 5.3 }
];

export const configPontos: ConfigPontos = {
  pontosPorKg: 30,
  pontosPorGarrafa: 10,
  valorReaisPorPonto: 0.005,
  splitCondominio: 0.7
};

export const recompensas: Recompensa[] = [
  { id: 'r_desc_10', titulo: 'R$ 10 desconto no boleto', descricao: 'Aplicado no proximo condominio', ico: '💰', custoPontos: 2000, parceiro: 'Condominio', estoque: 50 },
  { id: 'r_desc_25', titulo: 'R$ 25 desconto no boleto', descricao: 'Aplicado no proximo condominio', ico: '💰', custoPontos: 5000, parceiro: 'Condominio', estoque: 30 },
  { id: 'r_arvore', titulo: 'Adocao de 1 arvore', descricao: 'Plantio em parceria SOS Mata Atlantica', ico: '🌳', custoPontos: 3500, parceiro: 'SOS Mata Atlantica', estoque: 20 },
  { id: 'r_sacola', titulo: `Sacola eco ${BRAND.name}`, descricao: 'Entrega na portaria', ico: '🛍️', custoPontos: 1200, parceiro: BRAND.name, estoque: 40 },
  { id: 'r_cinema', titulo: '2 ingressos Cinemark', descricao: 'Voucher digital', ico: '🎬', custoPontos: 4500, parceiro: 'Cinemark', estoque: 15 },
  { id: 'r_ifood', titulo: 'R$ 30 iFood', descricao: 'Voucher digital', ico: '🍔', custoPontos: 6000, parceiro: 'iFood', estoque: 10 }
];
