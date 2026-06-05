import { AuthGuard } from '@/components/ui/auth-guard';
import { MoradorShell } from '@/components/ui/morador-shell';
import { HistoricoMoradorScreen } from '@/features/morador/historico-screen';

export default function HistoricoMoradorPage() {
  return <AuthGuard persona="morador"><MoradorShell><HistoricoMoradorScreen /></MoradorShell></AuthGuard>;
}
