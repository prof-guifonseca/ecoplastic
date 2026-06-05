'use client';

import { Button, EmptyState } from '@/components/ui/primitives';
import { num } from '@/domain/format';
import { moradorAtual } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/dialog';
import { rewardIcon } from '@/components/ui/icons';

export function TrocarMoradorScreen() {
  const { state, actions } = useEcoPlastic();
  const { notify } = useToast();
  const confirm = useConfirm();
  const morador = moradorAtual(state);
  if (!morador) return <EmptyState>Morador nao encontrado.</EmptyState>;

  const resgatar = async (recompensaId: string) => {
    const recompensa = state.recompensas.find((item) => item.id === recompensaId);
    if (!recompensa) return;
    const ok = await confirm({ title: `Resgatar ${recompensa.titulo}?`, description: `Custa ${num(recompensa.custoPontos)} pontos do seu saldo.`, confirmLabel: 'Resgatar' });
    if (!ok) return;
    try {
      actions.resgatarRecompensa(morador.id, recompensaId);
      notify('success', 'Resgatado', `Confira no historico: ${recompensa.titulo}.`);
    } catch (error) {
      notify('error', 'Falha no resgate', error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <>
      <h2 className="p-greet">Trocar pontos</h2>
      <div className="p-balance">
        <div className="eyebrow">Saldo</div>
        <div className="pts">{num(morador.pontos)} pts</div>
      </div>
      <div className="p-rewards">
        {state.recompensas.map((recompensa) => {
          const pode = morador.pontos >= recompensa.custoPontos && recompensa.estoque > 0;
          return (
            <div className="p-reward" key={recompensa.id}>
              <div className="ico">{rewardIcon(recompensa.ico)}</div>
              <div className="ttl">{recompensa.titulo}</div>
              <div className="desc">{recompensa.descricao} · {recompensa.estoque} em estoque</div>
              <div className="flex items-center justify-between mt-2">
                <div className="cost">{num(recompensa.custoPontos)} pts</div>
                <Button size="sm" variant={pode ? 'primary' : 'secondary'} disabled={!pode} onClick={() => resgatar(recompensa.id)}>
                  {recompensa.estoque <= 0 ? 'Esgotado' : 'Trocar'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
