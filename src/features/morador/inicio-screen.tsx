'use client';

import { EmptyState } from '@/components/ui/primitives';
import { feedIcon, MapPin, medalIcon, Recycle } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { brl, dec, num, rel } from '@/domain/format';
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
  const proxima = [...state.recompensas]
    .filter((recompensa) => recompensa.custoPontos > morador.pontos)
    .sort((a, b) => a.custoPontos - b.custoPontos)[0];
  const faltam = proxima ? proxima.custoPontos - morador.pontos : 0;
  const progresso = proxima ? Math.min(100, Math.round((morador.pontos / proxima.custoPontos) * 100)) : 100;

  return (
    <>
      <h2 className="p-greet">{cumprimento}, {morador.nome.split(' ')[0]}</h2>
      <div className="p-balance">
        <div className="eyebrow">Seu saldo</div>
        <div className="pts">{num(morador.pontos)} pts</div>
        <div>≈ {brl(equiv)} de desconto disponivel</div>
        <div className="p-balance-goal">
          <div className="p-balance-goal-track"><div className="p-balance-goal-fill" style={{ width: `${progresso}%` }} /></div>
          <div className="p-balance-goal-label">
            {proxima ? <>Faltam <b>{num(faltam)} pts</b> para {proxima.titulo}</> : 'Voce ja pode resgatar todas as recompensas!'}
          </div>
        </div>
      </div>

      <div className="p-ministats">
        <div><b>{dec(morador.kgTotal)} kg</b><span>reciclados por voce</span></div>
        <div><b>#{minhaPos}</b><span>no ranking do predio</span></div>
      </div>

      <div className="p-section-title">Atividade recente</div>
      <div className="p-feed">
        {recentes.length ? recentes.map((transacao) => {
          const recompensa = state.recompensas.find((item) => item.id === transacao.recompensaId);
          return (
            <div className="p-feed-item" key={transacao.id}>
              <div className="ico">{feedIcon(transacao.tipo)}</div>
              <div>
                <div className="ttl">{transacao.tipo === 'deposito' ? `${transacao.kg} kg de PET descartados` : `Resgate: ${recompensa?.titulo ?? 'Recompensa'}`}</div>
                <div className="meta">{rel(transacao.ts)}</div>
              </div>
              <div className={`pts ${transacao.pontos < 0 ? 'neg' : ''}`}>{transacao.pontos > 0 ? '+' : ''}{transacao.pontos}</div>
            </div>
          );
        }) : <EmptyState icon={<Recycle size={28} />}>Sem atividade ainda. Use o QR na maquina.</EmptyState>}
      </div>

      <div className="p-section-title">Sua posicao</div>
      <div className="p-feed">
        {top3.map((item, index) => (
          <div className={cn('p-feed-item', item.id === morador.id && 'me')} key={item.id}>
            <div className="ico">{medalIcon(index)}</div>
            <div>
              <div className="ttl">{item.id === morador.id ? `Voce (#${minhaPos})` : item.nome}</div>
              <div className="meta">Apto {item.apto}</div>
            </div>
            <div className="pts">{num(item.pontos)}</div>
          </div>
        ))}
        {minhaPos > 3 ? (
          <div className="p-feed-item me">
            <div className="ico"><MapPin size={18} /></div>
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
