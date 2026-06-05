import { ConfigScreen } from '@/features/admin/config-screen';
import { AuthGuard } from '@/components/ui/auth-guard';
import { SindicoShell } from '@/components/ui/sindico-shell';

export default function ConfigPage() {
  return <AuthGuard persona="sindico"><SindicoShell><ConfigScreen /></SindicoShell></AuthGuard>;
}
