import { supabase } from '@/lib/supabase';

export type AdminAccess = 'admin' | 'forbidden';

export async function fetchAdminExists(): Promise<boolean> {
  const { data, error } = await supabase.rpc('admin_exists');
  if (error) throw new Error(error.message);
  return data === true;
}

export async function claimAdminAccess(): Promise<AdminAccess> {
  const { data, error } = await supabase.rpc('claim_admin');
  if (error) throw new Error(error.message);
  return data === true ? 'admin' : 'forbidden';
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(translateAuthError(error.message));
}

export async function signUpAdmin(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(translateAuthError(error.message));
  if (!data.session) {
    throw new Error(
      'A conta foi criada, mas não foi possível entrar. Desative a confirmação de e-mail no painel do Supabase.',
    );
  }
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Não foi possível sair. Tente novamente.');
}

function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return 'Este e-mail já está cadastrado.';
  }
  if (lower.includes('password')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  }
  return 'Não foi possível concluir a operação. Tente novamente.';
}
