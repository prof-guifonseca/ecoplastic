import { AuthGuard } from '@/components/ui/auth-guard';
import { MoradorShell } from '@/components/ui/morador-shell';
import { InicioMoradorScreen } from '@/features/morador/inicio-screen';

export default function InicioMoradorPage() {
  return <AuthGuard persona="morador"><MoradorShell><InicioMoradorScreen /></MoradorShell></AuthGuard>;
}
