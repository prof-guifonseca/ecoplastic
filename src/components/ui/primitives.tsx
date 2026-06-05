import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
}

export function Button({ className = '', variant = 'secondary', size = 'md', ...props }: ButtonProps) {
  return <button className={`btn ${variant} ${size === 'sm' ? 'sm' : ''} ${className}`} {...props} />;
}

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={`card ${className}`} {...props} />;
}

export function KpiCard({ label, value, delta, negative }: { label: string; value: string; delta?: string; negative?: boolean }) {
  return (
    <Card className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta ? <div className={`delta ${negative ? 'neg' : ''}`}>{delta}</div> : null}
    </Card>
  );
}

export function EmptyState({ icon = '📭', children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="ico" aria-hidden="true">{icon}</div>
      <p>{children}</p>
    </div>
  );
}

export function Tag({ tone, children }: { tone: 'ok' | 'info' | 'warn' | 'bad'; children: React.ReactNode }) {
  return <span className={`tag ${tone}`}>{children}</span>;
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="err">{error}</small> : null}
    </label>
  );
}
