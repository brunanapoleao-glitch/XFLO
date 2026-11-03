import { useEffect, useState } from 'react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminPanel from '@/components/admin/AdminPanel';
import { Button } from '@/components/ui/Button';
import { XfloWordmark } from '@/components/ui/XfloLogo';
import { useAdminSession, type AdminSession } from '@/hooks/useAdminSession';
import { signOutAdmin } from '@/lib/adminAuth';

export default function AdminPage() {
  const session = useAdminSession();

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    document.title = 'Área do administrador | XFLO';

    return () => {
      robots.remove();
    };
  }, []);

  return (
    <div className="min-h-[100svh] bg-ink">
      {session.status === 'admin' ? (
        <AdminPanel />
      ) : (
        <div className="flex min-h-[100svh] flex-col items-center justify-center gap-10 px-5 py-16">
          <XfloWordmark />
          <AdminGate status={session.status} setupRequired={session.setupRequired} />
        </div>
      )}
    </div>
  );
}

function AdminGate({ status, setupRequired }: AdminSession) {
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  if (status === 'loading') {
    return (
      <p className="animate-fade-in text-sm text-mist-muted" role="status">
        Verificando acesso...
      </p>
    );
  }

  if (status === 'signed-out') {
    return <AdminLoginForm setupRequired={setupRequired} />;
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOutAdmin();
    } catch (caught) {
      setSignOutError(caught instanceof Error ? caught.message : 'Não foi possível sair.');
      setSigningOut(false);
    }
  };

  const isForbidden = status === 'forbidden';

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
      <h1 className="text-xl font-bold text-mist">
        {isForbidden ? 'Esta conta não tem acesso de administrador' : 'Não foi possível verificar seu acesso'}
      </h1>
      <p className="text-pretty text-sm leading-relaxed text-mist-muted">
        {isForbidden
          ? 'Entre com a conta cadastrada como administradora do site.'
          : 'Verifique sua conexão e tente novamente.'}
      </p>
      {signOutError && <p className="text-sm text-red-200">{signOutError}</p>}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {isForbidden ? (
          <Button variant="secondary" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? 'Saindo...' : 'Sair e trocar de conta'}
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
