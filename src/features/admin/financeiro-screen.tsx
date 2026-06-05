'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button, Card, KpiCard } from '@/components/ui/primitives';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { brl, dec, num } from '@/domain/format';
import { acumuladoAno, projecaoAnual, saldoCondominio, simulateFinanceiro } from '@/domain/selectors';
import { BRAND } from '@/domain/brand';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';
import { SourceNote } from '@/components/ui/source-note';

const SplitDonutChart = dynamic(() => import('@/components/charts/split-donut-chart').then((mod) => mod.SplitDonutChart), {
  ssr: false,
  loading: () => <ChartSkeleton minHeight={160} />
});

export function FinanceiroScreen() {
  const { state } = useEcoPlastic();
  const { notify } = useToast();
  const [unidades, setUnidades] = useState(84);
  const [engajamento, setEngajamento] = useState(74);
  const saldo = saldoCondominio(state);
  const acumulado = acumuladoAno(state);
  const projecao = projecaoAnual(state);
  const splitPct = Math.round(state.configPontos.splitCondominio * 100);
  const simulacao = useMemo(() => simulateFinanceiro(state, unidades, engajamento), [engajamento, state, unidades]);

  const compartilhar = async () => {
    const text = `Nosso condominio gerou ${brl(saldo)} reciclando PET com a ${BRAND.name}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: BRAND.name, text });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(text);
    notify('success', 'Resumo copiado', 'Cole onde quiser compartilhar.');
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Financeiro</h1>
          <div className="sub">Receita gerada e simulacao</div>
        </div>
        <Button onClick={compartilhar}><Share2 size={17} /> Compartilhar resumo</Button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <KpiCard label="Saldo do condominio" value={brl(saldo)} delta="aplicavel no boleto" />
        <KpiCard label={`Acumulado ${new Date().getFullYear()}`} value={brl(acumulado)} />
        <KpiCard label="Projecao anual" value={brl(projecao)} delta="baseado nos ultimos 6 meses" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <Card>
          <h3>Reparticao da receita</h3>
          <div className="split-bar"><div className="seg-a" /><div className="seg-b" /></div>
          <div className="split-legend">
            <div><span className="dot" style={{ background: 'var(--c-brand)' }} /><b>{splitPct}%</b> Condominio</div>
            <div><span className="dot" style={{ background: 'var(--c-accent)' }} /><b>{100 - splitPct}%</b> {BRAND.name}</div>
          </div>
          <p className="sub">{BRAND.name} cobre operacao da maquina, integracao com cooperativa, plataforma e suporte.</p>
          <div className="chart-wrap sm"><SplitDonutChart split={state.configPontos.splitCondominio} /></div>
          <SourceNote>Reparticao 70/30 e uma hipotese de modelo de negocio (nao e fato cientifico).</SourceNote>
        </Card>

        <Card>
          <h3>Uso do saldo</h3>
          <div className="form-grid">
            {[
              { label: 'Credito no boleto do condominio', value: brl(saldo * 0.6) },
              { label: 'Pontos para moradores', value: brl(saldo * 0.25) },
              { label: 'Fundo reserva sustentavel', value: brl(saldo * 0.1) },
              { label: 'Saldo a aplicar', value: brl(saldo * 0.05) }
            ].map((row) => (
              <div className="next-pickup" style={{ padding: 10, border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,.04)' }} key={row.label}>
                <span>{row.label}</span>
                <b>{row.value}</b>
              </div>
            ))}
          </div>
          <Button variant="primary" style={{ marginTop: 14, width: '100%' }} onClick={() => notify('success', 'Reparticao aplicada', 'Credito agendado para o proximo boleto.')}>
            Aplicar reparticao automatica
          </Button>
        </Card>
      </div>

      <Card className="simulator">
        <h3>Simulador de receita</h3>
        <p className="sub">Estime a receita anual do seu condominio.</p>
        <div className="row">
          <div>
            <div className="label">Unidades habitacionais</div>
            <input type="range" min="20" max="300" value={unidades} step="2" onChange={(event) => setUnidades(Number(event.target.value))} />
          </div>
          <div className="val">{unidades}</div>
        </div>
        <div className="row">
          <div>
            <div className="label">Engajamento dos moradores</div>
            <input type="range" min="20" max="100" value={engajamento} step="1" onChange={(event) => setEngajamento(Number(event.target.value))} />
          </div>
          <div className="val">{engajamento}%</div>
        </div>
        <div className="result">
          <div className="label">Receita anual estimada</div>
          <div className="big">{brl(simulacao.receitaAnual)}</div>
          <div className="sub">{dec(simulacao.kgMes)} kg/mes · {num(unidades)} unidades</div>
        </div>
        <SourceNote>Premissas: 5,8 kg/morador.mes (faixa 4-8) e R$/kg da cooperativa (CEMPRE). Ver docs/metodologia-financeira.md.</SourceNote>
      </Card>
    </>
  );
}
