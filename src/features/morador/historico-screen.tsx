'use client';

import { EmptyState } from '@/components/ui/primitives';
import { dt, time } from '@/domain/format';
import { moradorAtual, transacoesDoMorador } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';

export function HistoricoMoradorScreen() {
  const { state } = useEcoPlastic();
  const morador = moradorAtual(state);
  if (!morador) return <EmptyState>Morador nao encontrado.</EmptyState>;
  const transacoes = transacoesDoMorador(state, morador.id);
  const groups = new Map<string, typeof transacoes>();
  for (const transacao of transacoes) {
    const key = new Date(transacao.ts).toDateString();
    groups.set(key, [...(groups.get(key) ?? []), transacao]);
  }

  return (
    <>
      <h2 className="p-greet">Historico</h2>
      {transacoes.length === 0 ? <EmptyState>Sem atividade ainda. Comece descartando uma garrafa.</EmptyState> : null}
      {Array.from(groups.entries()).map(([day, items]) => (
        <section key={day}>
          <div className="p-section-title">{dt(new Date(day))}</div>
          <div className="p-feed">
            {items.map((transacao) => {
              const recompensa = state.recompensas.find((item) => item.id === transacao.recompensaId);
              return (
                <div className="p-feed-item" key={transacao.id}>
                  <div className="ico">{transacao.tipo === 'deposito' ? '♻' : '🎁'}</div>
                  <div>
                    <div className="ttl">{transacao.tipo === 'deposito' ? `${transacao.kg} kg PET` : recompensa?.titulo ?? 'Resgate'}</div>
                    <div className="meta">{time(transacao.ts)}</div>
                  </div>
                  <div className={`pts ${transacao.pontos < 0 ? 'neg' : ''}`}>{transacao.pontos > 0 ? '+' : ''}{transacao.pontos}</div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
