'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button, Card, Field, KpiCard, Tag } from '@/components/ui/primitives';
import { brl, dec, initials, num } from '@/domain/format';
import { pontosDistribuidosMes, ranking, totalAtivosMes, totalCadastrados } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';

export function MoradoresScreen() {
  const { state, actions } = useEcoPlastic();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [apto, setApto] = useState('');
  const top = ranking(state, 20);
  const ativos = totalAtivosMes(state);
  const cadastrados = totalCadastrados(state);
  const pendentes = state.convites.filter((convite) => convite.status === 'pendente').length;
  const pontos = pontosDistribuidosMes(state);
  const valor = pontos * state.configPontos.valorReaisPorPonto;

  const convidar = () => {
    try {
      actions.convidarMoradores([{ email, apto }]);
      setEmail('');
      setApto('');
      notify('success', 'Convite enviado', 'O morador recebeu um link simulado de cadastro.');
    } catch (error) {
      notify('error', 'Falha ao convidar', error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Moradores</h1>
          <div className="sub">Engajamento, ranking e convites</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <KpiCard label="Cadastrados" value={`${cadastrados}/${state.condominio.unidades}`} delta={`${pendentes} convite(s) pendente(s)`} />
        <KpiCard label="Ativos no mes" value={String(ativos)} delta={`${Math.round((ativos / cadastrados) * 100) || 0}% de adesao`} />
        <KpiCard label="Pontos distribuidos" value={num(pontos)} delta={`≈ ${brl(valor)}`} />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <Card>
          <h3>Convidar morador</h3>
          <div className="form-grid">
            <Field label="E-mail">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="morador@email.com" />
            </Field>
            <Field label="Apartamento">
              <input value={apto} onChange={(event) => setApto(event.target.value)} placeholder="1204" />
            </Field>
            <Button variant="primary" onClick={convidar}><UserPlus size={17} /> Enviar convite</Button>
          </div>
        </Card>
        <Card>
          <h3>Convites pendentes</h3>
          {state.convites.length ? (
            <div className="ranking-list">
              {state.convites.slice(-5).reverse().map((convite) => (
                <div className="ranking-row" style={{ gridTemplateColumns: '1fr auto' }} key={convite.id}>
                  <div>
                    <b>{convite.email}</b>
                    <div className="meta">Apto {convite.apto}</div>
                  </div>
                  <Tag tone={convite.status === 'pendente' ? 'warn' : 'ok'}>{convite.status}</Tag>
                </div>
              ))}
            </div>
          ) : <p className="sub">Nenhum convite criado nesta demonstracao.</p>}
        </Card>
      </div>

      <Card>
        <h3>Ranking - top 20</h3>
        <table className="table">
          <thead><tr><th>#</th><th>Morador</th><th>Apto</th><th>Kg total</th><th>Pontos</th><th>Bonus</th></tr></thead>
          <tbody>
            {top.map((morador, index) => (
              <tr key={morador.id}>
                <td><b style={{ color: 'var(--c-accent)' }}>{index + 1}º</b></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar">{initials(morador.nome)}</div>
                    <div>
                      <b>{morador.nome}</b>
                      <div style={{ fontSize: 11, color: 'var(--c-muted)' }}>{morador.email}</div>
                    </div>
                  </div>
                </td>
                <td>{morador.apto}</td>
                <td>{dec(morador.kgTotal)}</td>
                <td><b style={{ color: 'var(--c-brand)' }}>{num(morador.pontos)}</b></td>
                <td>{index < 3 ? <Tag tone="ok">{index === 0 ? '-R$ 50 boleto' : index === 1 ? '-R$ 25' : '-R$ 10'}</Tag> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
