const brlFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numFmt = new Intl.NumberFormat('pt-BR');
const num2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const brl = (n) => brlFmt.format(Number(n) || 0);
export const num = (n) => numFmt.format(Number(n) || 0);
export const dec = (n) => num2.format(Number(n) || 0);
export const pct = (n, base = 1) => `${Math.round((Number(n) / base) * 100)}%`;

export const dt = (d) => {
  if (!d) return '—';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
};
export const dtShort = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};
export const time = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Parse a YYYY-MM-DD string as local time (avoids UTC-midnight TZ shift)
export const parseLocalDate = (s) => {
  if (!s) return new Date(NaN);
  if (s instanceof Date) return s;
  if (typeof s === 'number') return new Date(s);
  const str = String(s);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return new Date(str);
};

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const monthLabel = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return `${months[date.getMonth()]}/${String(date.getFullYear()).slice(-2)}`;
};

export const rel = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const dys = Math.round(h / 24);
  if (dys < 30) return `há ${dys} dia${dys > 1 ? 's' : ''}`;
  return dt(d);
};

export const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
};
