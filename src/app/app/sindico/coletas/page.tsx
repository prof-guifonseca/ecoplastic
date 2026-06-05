import { ColetasScreen } from '@/features/admin/coletas-screen';
import { AuthGuard } from '@/components/ui/auth-guard';
import { SindicoShell } from '@/components/ui/sindico-shell';

export default function ColetasPage() {
  return <AuthGuard persona="sindico"><SindicoShell><ColetasScreen /></SindicoShell></AuthGuard>;
}
