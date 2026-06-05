// PRNG mulberry32: deterministico, rapido e bem distribuido.
// Substitui o "sine-hash" (Math.sin(i)*43758...) usado no seed por uma fonte
// reproduzivel e sem padrao visivel, mantendo a determinacao do buildSeed.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
