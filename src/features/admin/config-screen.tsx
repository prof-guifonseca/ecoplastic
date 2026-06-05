'use client';

import { ChangeEvent, useRef } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { Button, Card } from '@/components/ui/primitives';
import { BRAND } from '@/domain/brand';
import { brl } from '@/domain/format';
import { cooperativaAtual } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function ConfigScreen() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { state, actions } = useEcoPlastic();
  const { notify } = useToast();
  const confirm = useConfirm();
  const coop = cooperativaAtual(state);

  const importar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      actions.importarDados(await file.text());
      notify('success', 'Backup importado', 'O estado local foi substituido pelo arquivo selecionado.');
    } catch (error) {
      notify('error', 'Falha ao importar', error instanceof Error ? error.message : undefined);
    } finally {
      event.target.value = '';
    }
  };

  const reset = async () => {
    const ok = await confirm({ title: 'Resetar a demonstracao?', description: 'Volta ao seed deterministico inicial. Os dados locais atuais serao perdidos.', confirmLabel: 'Resetar', tone: 'danger' });
    if (!ok) return;
    actions.resetarDemo();
    notify('success', 'Dados resetados', 'Voltamos ao seed deterministico inicial.');
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Configuracoes</h1>
          <div className="sub">Programa de pontos, cooperativa, backup e demo offline</div>
        </div>
      </div>

      <div className="grid grid-2">
        <Card>
          <h3>Programa de pontos</h3>
          <div className="form-grid">
            {[
              { label: 'Pontos por garrafa', value: state.configPontos.pontosPorGarrafa },
              { label: 'Pontos por kg compactado', value: state.configPontos.pontosPorKg },
              { label: 'Conversao (R$ por ponto)', value: brl(state.configPontos.valorReaisPorPonto) },
              { label: 'Reparticao condominio', value: `${Math.round(state.configPontos.splitCondominio * 100)}%` }
            ].map((row) => (
              <div className="next-pickup" key={row.label}>
                <span className="sub">{row.label}</span>
                <b>{row.value}</b>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3>Cooperativa parceira</h3>
          {coop ? (
            <div className="boxed mb-3.5">
              <div className="font-extrabold text-base">{coop.nome}</div>
              <div className="sub">{brl(coop.precoKg)}/kg · {coop.distanciaKm} km</div>
            </div>
          ) : null}
          <div className="form-grid">
            {state.cooperativa.lista.map((item) => (
              <label className={cn('next-pickup boxed', item.id === state.cooperativa.atualId && 'active-coop')} key={item.id}>
                <span>
                  <input
                    type="radio"
                    name="coop"
                    checked={item.id === state.cooperativa.atualId}
                    onChange={() => {
                      actions.trocarCooperativa(item.id);
                      notify('success', 'Cooperativa atualizada', `Proximas coletas com ${item.nome}.`);
                    }}
                    className="mr-2"
                  />
                  {item.nome}
                </span>
                <b>{brl(item.precoKg)}/kg</b>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h3>Maquina compactadora</h3>
          <div className="form-grid">
            <div className="next-pickup"><span className="sub">ID</span><b>{state.maquina.id}</b></div>
            <div className="next-pickup"><span className="sub">Capacidade</span><b>{state.maquina.capacidadeKg} kg</b></div>
            <div className="next-pickup"><span className="sub">Ocupacao atual</span><b>{state.maquina.ocupadoKg.toFixed(1)} kg</b></div>
            <div className="bar"><div className="fill" style={{ width: `${Math.round((state.maquina.ocupadoKg / state.maquina.capacidadeKg) * 100)}%` }} /></div>
          </div>
        </Card>

        <Card>
          <h3>Backup offline</h3>
          <p className="sub">Exporte/importa JSON para manter uma demonstracao viva sem banco de dados.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={actions.exportarDados}><Download size={17} /> Exportar JSON</Button>
            <Button onClick={() => inputRef.current?.click()}><Upload size={17} /> Importar JSON</Button>
            <Button variant="danger" onClick={reset}><RotateCcw size={17} /> Resetar demo</Button>
          </div>
          <input ref={inputRef} type="file" accept="application/json,.json" onChange={importar} hidden />
          <p className="sub mt-3.5">
            Chave local atual: <code>{BRAND.storageKey}</code>.
          </p>
        </Card>

        <Card>
          <h3>Auditoria local</h3>
          <div className="ranking-list">
            {state.auditLog.slice(0, 8).map((event) => (
              <div className="ranking-row compact" key={event.id}>
                <div>
                  <b>{event.summary}</b>
                  <div className="meta">{event.action} · {new Date(event.ts).toLocaleString('pt-BR')}</div>
                </div>
                <span className="tag info">{event.actor}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
