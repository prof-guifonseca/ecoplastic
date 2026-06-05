'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Gift, History, Home, LogOut, QrCode, Recycle } from 'lucide-react';
import { BRAND } from '@/domain/brand';
import { moradorAtual } from '@/domain/selectors';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from './toast';

const NAV = [
  { href: '/app/morador/inicio/', label: 'Inicio', icon: Home },
  { href: '/app/morador/historico/', label: 'Historico', icon: History },
  { href: '/app/morador/trocar/', label: 'Trocar', icon: Gift },
  { href: '/app/morador/qr/', label: 'QR', icon: QrCode }
];

export function MoradorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, actions } = useEcoPlastic();
  const { notify } = useToast();
  const morador = moradorAtual(state);

  return (
    <div className="phone-stage">
      <div className="phone-shell">
        <header className="phone-top">
          <div className="brand-mini">
            <div className="logo">♻</div>
            <div>
              <strong>{BRAND.name}</strong>
              <small>{morador ? `Apto ${morador.apto}` : 'App do morador'}</small>
            </div>
          </div>
          <button
            aria-label="Sair"
            className="icon-button"
            type="button"
            onClick={() => {
              actions.logout();
              notify('info', 'Perfil encerrado');
              router.push('/app/login/');
            }}
          >
            <LogOut size={17} />
          </button>
        </header>
        <section className="phone-content">{children}</section>
        <nav className="phone-nav" aria-label="Navegacao do morador">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link className={active ? 'active' : ''} href={item.href} key={item.href}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="phone-aside">
        <Recycle size={28} />
        <h1>{BRAND.name}</h1>
        <p>Experiencia mobile de pontos, historico, recompensas e QR para descarte de PET.</p>
      </div>
    </div>
  );
}
