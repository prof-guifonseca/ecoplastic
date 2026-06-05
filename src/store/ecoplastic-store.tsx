'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BRAND } from '@/domain/brand';
import {
  cancelarColeta,
  convidarMoradores,
  depositarPET,
  reagendarColeta,
  resetarDemo,
  resgatarRecompensa,
  setPersona,
  solicitarColeta,
  trocarCooperativa
} from '@/domain/actions';
import { buildSeed } from '@/domain/seed';
import type { EcoPlasticState } from '@/domain/types';
import { loadPersistedState, makeExportEnvelope, saveState, stateFromImport } from './persistence';

interface StoreContextValue {
  state: EcoPlasticState;
  hydrated: boolean;
  lastStorageMessage: string | null;
  actions: {
    entrarComoSindico: () => void;
    entrarComoMorador: (moradorId: string) => void;
    logout: () => void;
    depositarPET: (moradorId: string, kg: number) => ReturnType<typeof depositarPET>['transacao'];
    resgatarRecompensa: (moradorId: string, recompensaId: string) => ReturnType<typeof resgatarRecompensa>['transacao'];
    solicitarColeta: (input: { data: string; observacao?: string }) => ReturnType<typeof solicitarColeta>['coleta'];
    reagendarColeta: (coletaId: string, novaData: string) => void;
    cancelarColeta: (coletaId: string) => void;
    trocarCooperativa: (cooperativaId: string) => void;
    convidarMoradores: (rows: Array<{ email: string; apto: string }>) => ReturnType<typeof convidarMoradores>['convites'];
    resetarDemo: () => void;
    exportarDados: () => void;
    importarDados: (raw: string) => void;
  };
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function EcoPlasticProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EcoPlasticState>(() => buildSeed());
  const stateRef = useRef(state);
  const [hydrated, setHydrated] = useState(false);
  const [lastStorageMessage, setLastStorageMessage] = useState<string | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const result = loadPersistedState();
    if (result.state) {
      setState(result.state);
    } else if (result.error) {
      setLastStorageMessage(`Dados locais invalidos foram ignorados: ${result.error}.`);
    } else {
      const seed = buildSeed();
      setState(seed);
      saveState(seed);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [hydrated, state]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== BRAND.storageKey || !event.newValue) return;
      try {
        // Valida sempre (sem fallback para JSON.parse cru): dados de outra aba
        // tambem passam pelo schema antes de virar estado.
        const imported = stateFromImport(event.newValue);
        if (!imported) return;
        setState(imported);
        setLastStorageMessage('Dados atualizados em outra aba.');
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const commit = useCallback((updater: (current: EcoPlasticState) => EcoPlasticState) => {
    let nextState: EcoPlasticState | null = null;
    setState((current) => {
      nextState = updater(current);
      stateRef.current = nextState;
      return nextState;
    });
    return nextState;
  }, []);

  const actions = useMemo<StoreContextValue['actions']>(() => ({
    entrarComoSindico: () => { commit((current) => setPersona(current, 'sindico')); },
    entrarComoMorador: (moradorId) => { commit((current) => setPersona(current, 'morador', moradorId)); },
    logout: () => { commit((current) => setPersona(current, null)); },
    depositarPET: (moradorId, kg) => {
      let transacao: ReturnType<typeof depositarPET>['transacao'] | undefined;
      commit((current) => {
        const result = depositarPET(current, { moradorId, kg });
        transacao = result.transacao;
        return result.state;
      });
      if (!transacao) throw new Error('Falha ao registrar deposito');
      return transacao;
    },
    resgatarRecompensa: (moradorId, recompensaId) => {
      let transacao: ReturnType<typeof resgatarRecompensa>['transacao'] | undefined;
      commit((current) => {
        const result = resgatarRecompensa(current, { moradorId, recompensaId });
        transacao = result.transacao;
        return result.state;
      });
      if (!transacao) throw new Error('Falha no resgate');
      return transacao;
    },
    solicitarColeta: (input) => {
      let coleta: ReturnType<typeof solicitarColeta>['coleta'] | undefined;
      commit((current) => {
        const result = solicitarColeta(current, input);
        coleta = result.coleta;
        return result.state;
      });
      if (!coleta) throw new Error('Falha ao solicitar coleta');
      return coleta;
    },
    reagendarColeta: (coletaId, novaData) => { commit((current) => reagendarColeta(current, coletaId, novaData)); },
    cancelarColeta: (coletaId) => { commit((current) => cancelarColeta(current, coletaId)); },
    trocarCooperativa: (cooperativaId) => { commit((current) => trocarCooperativa(current, cooperativaId)); },
    convidarMoradores: (rows) => {
      let convites: ReturnType<typeof convidarMoradores>['convites'] | undefined;
      commit((current) => {
        const result = convidarMoradores(current, rows);
        convites = result.convites;
        return result.state;
      });
      if (!convites) throw new Error('Falha ao convidar moradores');
      return convites;
    },
    resetarDemo: () => { commit(() => resetarDemo(buildSeed())); },
    exportarDados: () => {
      const blob = new Blob([JSON.stringify(makeExportEnvelope(stateRef.current), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ecoplastic-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
    importarDados: (raw) => {
      const imported = stateFromImport(raw);
      if (!imported) throw new Error('Arquivo invalido ou incompatível');
      commit(() => imported);
    }
  }), [commit]);

  const value = useMemo(() => ({ state, hydrated, lastStorageMessage, actions }), [actions, hydrated, lastStorageMessage, state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useEcoPlastic() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useEcoPlastic must be used inside EcoPlasticProvider');
  return context;
}
