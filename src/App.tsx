import SiteSettingsProvider from '@/components/SiteSettingsProvider';
import WhatsappFloatingButton from '@/components/layout/WhatsappFloatingButton';
import AdminPage from '@/pages/AdminPage';
import HomePage from '@/pages/HomePage';

function getNormalizedPath(): string {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export default function App() {
  const isAdminRoute = getNormalizedPath() === '/admin';

  return (
    <SiteSettingsProvider>
      {isAdminRoute ? <AdminPage /> : <HomePage />}
      <WhatsappFloatingButton />
    </SiteSettingsProvider>
  );
}
