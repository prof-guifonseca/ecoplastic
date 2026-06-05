'use client';

import { EmptyState } from '@/components/ui/primitives';
import { brl, num, rel } from '@/domain/format';
import { moradorAtual, posicaoDe, ranking, transacoesDoMorador } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';

export function InicioMoradorScreen() {
  const { state } = useEcoPlastic();
  const morador = moradorAtual(state);
  if (!morador) return <EmptyState>Morador nao encontrado.</EmptyState>;

  const equiv = morador.pontos * state.configPontos.valorReaisPorPonto;
  const recentes = transacoesDoMorador(state, morador.id).slice(0, 5);
  const top3 = ranking(state, 3);
  const minhaPos = posicaoDe(state, morador.id);
  const hora = new Date().getHours();
  const cumprimento = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <>
      <h2 className="p-greet">{cumprimento}, {morador.nome.split(' ')[0]}</h2>
      <div className="p-balance">
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', opacity: .85 }}>Seu saldo</div>
        <div className="pts">{num(morador.pontos)} pts</div>
        <div>≈ {brl(equiv)} de desconto disponivel</div>
      </div>

      <div className="p-section-title">Atividade recente</div>
      <div className="p-feed">
        {recentes.length ? recentes.map((transacao) => {
          const recompensa = state.recompensas.find((item) => item.id === transacao.recompensaId);
          return (
            <div className="p-feed-item" key={transacao.id}>
              <div className="ico">{transacao.tipo === 'deposito' ? '♻' : '🎁'}</div>
              <div>
                <div className="ttl">{transacao.tipo === 'deposito' ? `${transacao.kg} kg de PET descartados` : `Resgate: ${recompensa?.titulo ?? 'Recompensa'}`}</div>
                <div className="meta">{rel(transacao.ts)}</div>
              </div>
              <div className={`pts ${transacao.pontos < 0 ? 'neg' : ''}`}>{transacao.pontos > 0 ? '+' : ''}{transacao.pontos}</div>
            </div>
          );
        }) : <EmptyState icon="♻">Sem atividade ainda. Use o QR na maquina.</EmptyState>}
      </div>

      <div className="p-section-title">Sua posicao</div>
      <div className="p-feed">
        {top3.map((item, index) => (
          <div className="p-feed-item" style={item.id === morador.id ? { borderColor: 'var(--c-brand)' } : undefined} key={item.id}>
            <div className="ico">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
            <div>
              <div className="ttl">{item.id === morador.id ? `Voce (#${minhaPos})` : item.nome}</div>
              <div className="meta">Apto {item.apto}</div>
            </div>
            <div className="pts">{num(item.pontos)}</div>
          </div>
        ))}
        {minhaPos > 3 ? (
          <div className="p-feed-item" style={{ borderColor: 'var(--c-brand)' }}>
            <div className="ico">📍</div>
            <div>
              <div className="ttl">Voce</div>
              <div className="meta">Apto {morador.apto}</div>
            </div>
            <div className="pts">#{minhaPos}</div>
          </div>
        ) : null}
      </div>
    </>
  );
}
