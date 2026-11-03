import { useState, type FormEvent } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, fieldBorder } from '@/components/ui/fieldStyles';
import StatusBanner from '@/components/ui/StatusBanner';
import { signInAdmin, signUpAdmin } from '@/lib/adminAuth';

interface AdminLoginFormProps {
  setupRequired: boolean;
}

const GENERIC_ERROR = 'Não foi possível concluir a operação. Tente novamente.';

export default function AdminLoginForm({ setupRequired }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSetup = setupRequired;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Informe o e-mail e a senha.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (isSetup) {
        await signUpAdmin(email.trim(), password);
      } else {
        await signInAdmin(email.trim(), password);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : GENERIC_ERROR);
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-8 rounded-3xl border border-brand-deep/30 bg-night p-6 shadow-glow sm:p-10">
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep/25 text-brand-glow">
          {isSetup ? <UserPlus size={26} aria-hidden="true" /> : <LogIn size={26} aria-hidden="true" />}
        </div>
        <h1 className="text-2xl font-bold text-mist">
          {isSetup ? 'Criar conta de administrador' : 'Área do administrador'}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-mist-muted">
          {isSetup
            ? 'Esta conta será a única com acesso para editar o site. Guarde bem o e-mail e a senha.'
            : 'Entre com o e-mail e a senha do administrador para editar o site.'}
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Acesso do administrador">
        <div className="flex flex-col gap-2">
          <label htmlFor="admin-email" className="text-sm font-semibold text-mist">
            E-mail
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${FIELD_CLASS} ${fieldBorder(false)}`}
            placeholder="voce@exemplo.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="admin-password" className="text-sm font-semibold text-mist">
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete={isSetup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${FIELD_CLASS} ${fieldBorder(false)}`}
            placeholder={isSetup ? 'Mínimo de 6 caracteres' : 'Sua senha'}
          />
        </div>

        {error && <StatusBanner tone="error" message={error} />}

        <Button type="submit" disabled={busy} aria-busy={busy} className="w-full">
          {busy ? 'Aguarde...' : isSetup ? 'Criar conta e entrar' : 'Entrar'}
        </Button>
      </form>

      <a
        href="/"
        className="rounded-md text-center text-sm text-mist-muted underline-offset-4 transition hover:text-brand-glow hover:underline"
      >
        Voltar para o site
      </a>
    </div>
  );
}
