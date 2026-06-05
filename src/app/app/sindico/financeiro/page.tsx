import { FinanceiroScreen } from '@/features/admin/financeiro-screen';
import { AuthGuard } from '@/components/ui/auth-guard';
import { SindicoShell } from '@/components/ui/sindico-shell';

export default function FinanceiroPage() {
  return <AuthGuard persona="sindico"><SindicoShell><FinanceiroScreen /></SindicoShell></AuthGuard>;
}
