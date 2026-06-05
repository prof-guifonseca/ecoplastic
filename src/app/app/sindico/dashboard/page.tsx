import { DashboardScreen } from '@/features/admin/dashboard-screen';
import { AuthGuard } from '@/components/ui/auth-guard';
import { SindicoShell } from '@/components/ui/sindico-shell';

export default function DashboardPage() {
  return <AuthGuard persona="sindico"><SindicoShell><DashboardScreen /></SindicoShell></AuthGuard>;
}
