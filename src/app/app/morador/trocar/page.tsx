import { AuthGuard } from '@/components/ui/auth-guard';
import { MoradorShell } from '@/components/ui/morador-shell';
import { TrocarMoradorScreen } from '@/features/morador/trocar-screen';

export default function TrocarMoradorPage() {
  return <AuthGuard persona="morador"><MoradorShell><TrocarMoradorScreen /></MoradorShell></AuthGuard>;
}
