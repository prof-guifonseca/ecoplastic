// Fonte unica da paleta "paper" (superficie clara) do relatorio ESG.
// O CSS consome --paper-* (globals.css); o jsPDF (pdf.ts) consome os [r,g,b] daqui.
// Manter os dois em sincronia (mesmos hex). Ver docs/adr e esg-screen/pdf.ts.

type Rgb = [number, number, number];
interface PaperColor {
  hex: string;
  rgb: Rgb;
}

export const PAPER: Record<'bg' | 'bg2' | 'ink' | 'inkMuted' | 'accent' | 'border', PaperColor> = {
  bg: { hex: '#f8fffc', rgb: [248, 255, 252] },
  bg2: { hex: '#ffffff', rgb: [255, 255, 255] },
  ink: { hex: '#14201d', rgb: [20, 32, 29] },
  inkMuted: { hex: '#5a6968', rgb: [90, 105, 104] },
  accent: { hex: '#1e9f5a', rgb: [30, 159, 90] },
  border: { hex: '#cdd8d2', rgb: [205, 216, 210] }
};

// Faixa verde do cabecalho do PDF (== --c-brand) e sua tinta escura.
export const PAPER_BRAND: PaperColor = { hex: '#36d17f', rgb: [54, 209, 127] };
export const PAPER_BRAND_INK: PaperColor = { hex: '#04140b', rgb: [4, 20, 11] };

// Paleta do shell dark, para o global-error (que substitui o layout e nao pode
// assumir o globals.css/CSS vars carregados). Espelha --c-bg-0/--c-text/--c-muted/--c-brand.
export const SHELL = {
  bg: '#071114',
  ink: '#edf4f1',
  muted: '#94aaa6',
  brand: '#36d17f',
  brandInk: '#04140b'
} as const;
