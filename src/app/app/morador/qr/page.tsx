import { AuthGuard } from '@/components/ui/auth-guard';
import { MoradorShell } from '@/components/ui/morador-shell';
import { QrMoradorScreen } from '@/features/morador/qr-screen';

export default function QrMoradorPage() {
  return <AuthGuard persona="morador"><MoradorShell><QrMoradorScreen /></MoradorShell></AuthGuard>;
}
