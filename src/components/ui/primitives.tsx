import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
}

export function Button({ className, variant = 'secondary', size = 'md', ...props }: ButtonProps) {
  return <button className={cn('btn', variant, size === 'sm' && 'sm', className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cn('card', className)} {...props} />;
}

export function KpiCard({ label, value, delta, negative }: { label: string; value: string; delta?: string; negative?: boolean }) {
  return (
    <Card className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta ? <div className={cn('delta', negative && 'neg')}>{delta}</div> : null}
    </Card>
  );
}

export function EmptyState({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="empty">
      <div className="ico" aria-hidden="true">{icon ?? <Inbox size={30} />}</div>
      <p>{children}</p>
    </div>
  );
}

export function Tag({ tone, children }: { tone: 'ok' | 'info' | 'warn' | 'bad'; children: ReactNode }) {
  return <span className={cn('tag', tone)}>{children}</span>;
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="err">{error}</small> : null}
    </label>
  );
}
