'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, KpiCard } from '@/components/ui/primitives';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { CUSTO_REMOCAO_MES } from '@/content/financial-assumptions';
import { brl, dec, dt, initials, num, pct } from '@/domain/format';
import {
  metricasEsg,
  proximaAgendada,
  ranking,
  receitaMes,
  totalAtivosMes,
  totalCadastrados,
  totalKgMes,
  totaisMensais,
  variacaoMes
} from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';

const RevenueChart = dynamic(() => import('@/components/charts/revenue-chart').then((mod) => mod.RevenueChart), {
  ssr: false,
  loading: () => <ChartSkeleton minHeight={260} />
});

export function DashboardScreen() {
  const { state } = useEcoPlastic();
  const kg = totalKgMes(state, 0);
  const kgAnt = totalKgMes(state, 1) || 1;
  const kgVar = ((kg - kgAnt) / kgAnt) * 100;
  const receita = receitaMes(state, 0);
  const receitaVar = variacaoMes(state);
  const ativos = totalAtivosMes(state);
  const cadastrados = totalCadastrados(state);
  const metrics = metricasEsg(state);
  const ocupacao = Math.round((state.maquina.ocupadoKg / state.maquina.capacidadeKg) * 100);
  const top = ranking(state, 3);
  const prox = proximaAgendada(state);
  const split = state.configPontos.splitCondominio;
  const receitaLiquida = receita * split;
  const antes = CUSTO_REMOCAO_MES.value;
  const giro = antes + receitaLiquida;
  const baMax = Math.max(antes, receitaLiquida) || 1;

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
        </div>
      </div>

      <section className="hero">
        <div>
          <h2>Em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}, o lixo do predio gerou {brl(receitaLiquida)} em receita.</h2>
          <p>{dec(kg)} kg de PET reciclados · {num(metrics.garrafas)} garrafas · CO2 evitado: {metrics.co2Toneladas} t</p>
        </div>
        <div className={cn('pill', receitaVar.pct < 0 && 'neg')}>
          {receitaVar.pct >= 0 ? '▲' : '▼'} {pct(Math.abs(receitaVar.pct), 100)} vs mes anterior
        </div>
      </section>

      <div className="grid grid-4 mb-4">
        <KpiCard label="Reciclado" value={`${dec(kg)} kg`} delta={`${kgVar >= 0 ? '▲' : '▼'} ${pct(Math.abs(kgVar), 100)} vs mes ant.`} negative={kgVar < 0} />
        <KpiCard label="Receita do condominio" value={brl(receitaLiquida)} delta={`${receitaVar.abs >= 0 ? '▲' : '▼'} ${brl(Math.abs(receitaVar.abs * state.configPontos.splitCondominio))}`} negative={receitaVar.abs < 0} />
        <KpiCard label="Moradores ativos" value={`${ativos}/${cadastrados}`} delta={`${pct(ativos, cadastrados || 1)} de adesao`} />
        <KpiCard label="CO2 evitado" value={`${metrics.co2Toneladas} t`} delta="acumulado" />
      </div>

      <div className="grid grid-2 mb-4">
        <Card>
          <h3>Evolucao · ultimos 6 meses</h3>
          <div className="chart-wrap"><RevenueChart data={totaisMensais(state)} /></div>
        </Card>
        <Card>
          <h3>Antes x Depois</h3>
          <div className="ba-compare">
            <div className="ba-row">
              <div className="ba-head"><span className="label">Antes</span><b className="text-danger">-{brl(antes)}</b></div>
              <div className="ba-track"><div className="ba-fill neg" style={{ width: `${(antes / baMax) * 100}%` }} /></div>
              <p className="sub">despesa mensal com remocao (estimativa demonstrativa)</p>
            </div>
            <div className="ba-row">
              <div className="ba-head"><span className="label">Agora</span><b className="text-brand">+{brl(receitaLiquida)}</b></div>
              <div className="ba-track"><div className="ba-fill pos" style={{ width: `${(receitaLiquida / baMax) * 100}%` }} /></div>
              <p className="sub">receita liquida do condominio</p>
            </div>
            <div className="ba-result">
              <span>Giro mensal do condominio</span>
              <b className="text-brand">+{brl(giro)}</b>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-3">
        <Card>
          <h3>Capacidade da maquina</h3>
          <div className="big">{ocupacao}%</div>
          <div className={cn('bar', ocupacao > 80 && 'warn', 'mt-2.5')}><div className="fill" style={{ width: `${ocupacao}%` }} /></div>
          <p className="sub">{dec(state.maquina.ocupadoKg)} de {state.maquina.capacidadeKg} kg · proxima coleta {prox ? dt(prox.data) : 'a definir'}</p>
        </Card>
        <Card>
          <h3>Top 3 moradores</h3>
          <div className="ranking-list">
            {top.map((morador, index) => (
              <div className="ranking-row" key={morador.id}>
                <div className="pos">{index + 1}º</div>
                <div className="avatar">{initials(morador.nome)}</div>
                <div>
                  <div>{morador.nome}</div>
                  <div className="meta">Apto {morador.apto} · {dec(morador.kgTotal)} kg</div>
                </div>
                <div className="pts">{num(morador.pontos)} pts</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3>Proxima acao</h3>
          <p className="sub">Compartilhe o relatorio ESG do mes com os moradores e registre a evidencia no historico da demonstracao.</p>
          <Link className="btn primary mt-3" href="/app/sindico/esg/">
            Abrir relatorio <ArrowRight size={16} />
          </Link>
        </Card>
      </div>
    </>
  );
}
