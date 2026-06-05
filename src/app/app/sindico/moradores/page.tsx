import { MoradoresScreen } from '@/features/admin/moradores-screen';
import { AuthGuard } from '@/components/ui/auth-guard';
import { SindicoShell } from '@/components/ui/sindico-shell';

export default function MoradoresPage() {
  return <AuthGuard persona="sindico"><SindicoShell><MoradoresScreen /></SindicoShell></AuthGuard>;
}
