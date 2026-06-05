import { EsgScreen } from '@/features/admin/esg-screen';
import { AuthGuard } from '@/components/ui/auth-guard';
import { SindicoShell } from '@/components/ui/sindico-shell';

export default function EsgPage() {
  return <AuthGuard persona="sindico"><SindicoShell><EsgScreen /></SindicoShell></AuthGuard>;
}
