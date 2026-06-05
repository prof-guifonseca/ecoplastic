'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, CalendarCheck, ClipboardList, FileText, Home, LogOut, Recycle, Settings, Users, WalletCards } from 'lucide-react';
import { BRAND } from '@/domain/brand';
import { useEcoPlastic } from '@/store/ecoplastic-store';
import { useToast } from './toast';

const NAV = [
  { href: '/app/sindico/dashboard/', label: 'Dashboard', icon: BarChart3 },
  { href: '/app/sindico/coletas/', label: 'Coletas', icon: CalendarCheck },
  { href: '/app/sindico/financeiro/', label: 'Financeiro', icon: WalletCards },
  { href: '/app/sindico/moradores/', label: 'Moradores', icon: Users },
  { href: '/app/sindico/esg/', label: 'ESG', icon: FileText },
  { href: '/app/sindico/config/', label: 'Config', icon: Settings }
];

export function SindicoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, actions, lastStorageMessage } = useEcoPlastic();
  const { notify } = useToast();

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteudo</a>
      <aside className="sidebar">
        <Link className="brand-row" href="/">
          <div className="logo"><Recycle size={22} /></div>
          <div>
            <h2>{BRAND.name}</h2>
            <small>{state.condominio.nome}</small>
          </div>
        </Link>
        <nav aria-label="Navegacao do sindico">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link className={`nav-item ${active ? 'active' : ''}`} href={item.href} key={item.href}>
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <Link className="nav-item compact" href="/equipamento/">
            <ClipboardList size={16} />
            <span>Equipamento</span>
          </Link>
          <button
            className="nav-item compact"
            type="button"
            onClick={() => {
              actions.logout();
              notify('info', 'Perfil encerrado');
              router.push('/app/login/');
            }}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
          <Link className="nav-item compact" href="/">
            <Home size={16} />
            <span>Entrada</span>
          </Link>
          {lastStorageMessage ? <small className="storage-note">{lastStorageMessage}</small> : null}
        </div>
      </aside>
      <main className="admin-main" id="conteudo">{children}</main>
    </div>
  );
}
