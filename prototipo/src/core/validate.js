export const required = (v) => (v == null || v === '' ? 'Campo obrigatório' : null);
export const email = (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'E-mail inválido');
export const minLen = (n) => (v) => (!v || v.length >= n ? null : `Mínimo ${n} caracteres`);
export const numRange = (min, max) => (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return 'Número inválido';
  if (n < min || n > max) return `Entre ${min} e ${max}`;
  return null;
};
export const apto = (v) => (!v || /^[\w\d-]{1,8}$/i.test(v) ? null : 'Apto inválido');

export const compose = (...fns) => (v) => {
  for (const fn of fns) {
    const err = fn(v);
    if (err) return err;
  }
  return null;
};
