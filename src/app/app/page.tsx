import { ClientRedirect } from '@/features/legacy/client-redirect';

export default function AppIndexPage() {
  return <ClientRedirect to="/app/login/" />;
}
