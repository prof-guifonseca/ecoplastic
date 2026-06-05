import { describe, expect, it } from 'vitest';
import { brl, dec, initials, inputDate, num, parseLocalDate, pct } from '../format';

describe('format', () => {
  it('brl formata moeda BRL', () => {
    expect(brl(1234.5)).toContain('1.234,50');
    expect(brl(1234.5)).toContain('R$');
    expect(brl(0)).toContain('0,00');
  });

  it('num e dec', () => {
    expect(num(1234567)).toBe('1.234.567');
    expect(dec(2)).toBe('2');
    expect(dec(2.5)).toBe('2,5');
  });

  it('pct', () => {
    expect(pct(1, 4)).toBe('25%');
    expect(pct(50, 100)).toBe('50%');
  });

  it('initials', () => {
    expect(initials('Julia Ramos')).toBe('JR');
    expect(initials('Ana')).toBe('A');
  });

  it('parseLocalDate / inputDate round-trip', () => {
    const d = parseLocalDate('2026-06-19');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
    expect(inputDate(d)).toBe('2026-06-19');
  });
});
