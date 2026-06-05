'use client';

import {
  BadgeDollarSign,
  CalendarDays,
  Clapperboard,
  Droplet,
  Gift,
  Inbox,
  MapPin,
  Medal,
  Recycle,
  ShoppingBag,
  TreePine,
  TrendingUp,
  Trophy,
  Truck,
  UtensilsCrossed,
  Zap,
  type LucideIcon
} from 'lucide-react';
import type { ReactNode } from 'react';

// Estrategia de icones centralizada. 'line' = lucide (default, visual enterprise/serio).
// Trocar para 'emoji' reverte o app inteiro ao tom ludico numa unica edicao.
const STYLE: 'line' | 'emoji' = 'line';

const MEDAL_COLOR = ['#f3b35b', '#c0c7c9', '#cd7f4d']; // ouro, prata, bronze (rank 0,1,2)

/** Icone de posicao no ranking (medalha por rank). */
export function medalIcon(rank: number, size = 18): ReactNode {
  if (STYLE === 'emoji') return ['🥇', '🥈', '🥉'][rank] ?? '🏅';
  const color = MEDAL_COLOR[rank] ?? 'var(--c-muted)';
  const Cmp = rank === 0 ? Trophy : Medal;
  return <Cmp size={size} color={color} aria-hidden="true" />;
}

const REWARD_LINE: Record<string, LucideIcon> = {
  '💰': BadgeDollarSign,
  '🌳': TreePine,
  '🛍️': ShoppingBag,
  '🎬': Clapperboard,
  '🍔': UtensilsCrossed
};

/** Icone de recompensa, mapeando o glifo dos dados (recompensa.ico) para lucide. */
export function rewardIcon(ico: string, size = 22): ReactNode {
  if (STYLE === 'emoji') return ico;
  const Cmp = REWARD_LINE[ico] ?? Gift;
  return <Cmp size={size} aria-hidden="true" />;
}

/** Icone de item do feed (deposito vs resgate). */
export function feedIcon(tipo: 'deposito' | 'resgate' | 'bonus', size = 18): ReactNode {
  if (STYLE === 'emoji') return tipo === 'deposito' ? '♻' : '🎁';
  const Cmp = tipo === 'deposito' ? Recycle : Gift;
  return <Cmp size={size} aria-hidden="true" />;
}

// Re-exports para uso direto nas telas (banners, equivalencias, posicao, logos).
export { CalendarDays, Droplet, Gift, Inbox, MapPin, Recycle, TrendingUp, Truck, Zap };
