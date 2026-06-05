'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as RDialog from '@radix-ui/react-dialog';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Provider de confirmacao acessivel (Radix AlertDialog), substituindo window.confirm.
 * Uso: const confirm = useConfirm(); if (await confirm({...})) { ... }
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ title: '' });
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    setOpts(options);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    setOpen(false);
    resolver.current?.(value);
    resolver.current = null;
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog.Root open={open} onOpenChange={(next) => { if (!next) settle(false); }}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="dialog-overlay" />
          <AlertDialog.Content className="dialog-content">
            <AlertDialog.Title className="dialog-title">{opts.title}</AlertDialog.Title>
            <AlertDialog.Description className="dialog-desc">{opts.description ?? 'Confirme a acao.'}</AlertDialog.Description>
            <div className="dialog-actions">
              <AlertDialog.Cancel asChild>
                <button type="button" className="btn ghost" onClick={() => settle(false)}>{opts.cancelLabel ?? 'Cancelar'}</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button type="button" className={`btn ${opts.tone === 'danger' ? 'danger' : 'primary'}`} onClick={() => settle(true)}>{opts.confirmLabel ?? 'Confirmar'}</button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm precisa do ConfirmProvider');
  return ctx;
}

/** Modal de conteudo acessivel (Radix Dialog) — usado para formularios curtos. */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className="dialog-overlay" />
        <RDialog.Content className="dialog-content">
          <RDialog.Title className="dialog-title">{title}</RDialog.Title>
          <RDialog.Description className="dialog-desc">{description ?? ''}</RDialog.Description>
          {children}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
