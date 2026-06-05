'use client';

import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Button, Card, EmptyState, Field, Tag } from '@/components/ui/primitives';
import { brl, dec, dt, inputDate } from '@/domain/format';
import { cooperativaAtual, listarColetas, proximaAgendada } from '@/domain/selectors';
import type { ColetaStatus } from '@/domain/types';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';

const STATUS_TAG: Record<ColetaStatus, 'ok' | 'info' | 'warn' | 'bad'> = {
  concluida: 'ok',
  agendada: 'info',
  pendente: 'warn',
  cancelada: 'bad'
};

const STATUS_LABEL: Record<ColetaStatus, string> = {
  concluida: 'Pago',
  agendada: 'Agendada',
  pendente: 'Pendente',
  cancelada: 'Cancelada'
};

export function ColetasScreen() {
  const { state, actions } = useEcoPlastic();
  const { notify } = useToast();
  const [minDate] = useState(() => inputDate(new Date(Date.now() + 86_400_000)));
  const [data, setData] = useState(minDate);
  const [observacao, setObservacao] = useState('');
  const lista = listarColetas(state);
  const prox = proximaAgendada(state);
  const coop = cooperativaAtual(state);
  const coops = state.cooperativa.lista;
  const solicitar = () => {
    try {
      const coleta = actions.solicitarColeta({ data, observacao });
      setObservacao('');
      notify('success', 'Coleta solicitada', `Aguardando confirmacao para ${dt(coleta.data)}.`);
    } catch (error) {
      notify('error', 'Falha ao solicitar coleta', error instanceof Error ? error.message : undefined);
    }
  };

  const reagendar = (coletaId: string) => {
    const novaData = window.prompt('Nova data da coleta (AAAA-MM-DD)', minDate);
    if (!novaData) return;
    try {
      actions.reagendarColeta(coletaId, novaData);
      notify('success', 'Coleta reagendada', `Nova data: ${novaData}.`);
    } catch (error) {
      notify('error', 'Falha ao reagendar', error instanceof Error ? error.message : undefined);
    }
  };

  const cancelar = (coletaId: string) => {
    if (!window.confirm('Cancelar esta coleta? A cooperativa sera notificada na demonstracao.')) return;
    try {
      actions.cancelarColeta(coletaId);
      notify('info', 'Coleta cancelada');
    } catch (error) {
      notify('error', 'Falha ao cancelar', error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Coletas</h1>
          <div className="sub">Logistica com a cooperativa parceira</div>
        </div>
      </div>

      <div className="banner" style={{ marginBottom: 16 }}>
        <div className="ico">🚛</div>
        <div className="body">
          <b>Estrategia de coleta:</b> agrupamos as coletas com outros condominios da regiao para reduzir custo logistico.
          Cooperativa atual: <b>{coop?.nome ?? '-'}</b> ({coop ? brl(coop.precoKg) : '-'} / kg, {coop?.distanciaKm ?? '-'} km).
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <Card>
          <h3>Solicitar coleta avulsa</h3>
          <div className="form-grid">
            <Field label="Data desejada">
              <input type="date" min={minDate} value={data} onChange={(event) => setData(event.target.value)} />
            </Field>
            <Field label="Observacao opcional">
              <textarea value={observacao} onChange={(event) => setObservacao(event.target.value)} placeholder="Ex.: acesso pela portaria social" />
            </Field>
            <Button variant="primary" onClick={solicitar}><CalendarPlus size={17} /> Solicitar coleta</Button>
          </div>
        </Card>
        {prox ? (
          <Card className="next-pickup">
            <div>
              <div className="when">📅 {dt(prox.data)} · 14h</div>
              <div className="meta">Proxima coleta agendada com {coop?.nome}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button onClick={() => reagendar(prox.id)}>Reagendar</Button>
              <Button variant="danger" onClick={() => cancelar(prox.id)}>Cancelar</Button>
            </div>
          </Card>
        ) : <Card><EmptyState>Nenhuma coleta agendada.</EmptyState></Card>}
      </div>

      <Card>
        <h3>Historico</h3>
        {lista.length ? (
          <table className="table">
            <thead>
              <tr><th>Data</th><th>Cooperativa</th><th>Kg</th><th>R$/kg</th><th>Receita</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {lista.map((coleta) => {
                const cp = coops.find((item) => item.id === coleta.cooperativaId) ?? null;
                const preco = cp?.precoKg ?? (coleta.pesoKg ? coleta.valorBruto / coleta.pesoKg : 0);
                return (
                  <tr key={coleta.id}>
                    <td>{dt(coleta.data)}</td>
                    <td>{cp?.nome ?? '-'}</td>
                    <td>{coleta.pesoKg ? dec(coleta.pesoKg) : '-'}</td>
                    <td>{preco ? brl(preco) : '-'}</td>
                    <td>{coleta.valorBruto ? brl(coleta.valorBruto) : '-'}</td>
                    <td><Tag tone={STATUS_TAG[coleta.status]}>{STATUS_LABEL[coleta.status]}</Tag></td>
                    <td className="row-actions">
                      {coleta.status === 'agendada' || coleta.status === 'pendente' ? (
                        <Button size="sm" onClick={() => reagendar(coleta.id)}>Reagendar</Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <EmptyState>Nenhuma coleta registrada ainda.</EmptyState>}
      </Card>
    </>
  );
}
