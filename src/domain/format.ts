export const brl = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export const num = (value: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value || 0);

export const dec = (value: number, digits = 1) =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: value % 1 === 0 ? 0 : digits,
    maximumFractionDigits: digits
  }).format(value || 0);

export const pct = (value: number, base = 1) =>
  `${Math.round((value / base) * 100)}%`;

export const dt = (value: number | Date) =>
  new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export const time = (value: number) =>
  new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function rel(value: number) {
  const diff = Date.now() - value;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `ha ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `ha ${hours} h`;
  const days = Math.round(hours / 24);
  return `ha ${days} dia${days > 1 ? 's' : ''}`;
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 14, 0, 0, 0);
}

export function inputDate(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
