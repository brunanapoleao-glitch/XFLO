export const OTHER_SERVICE = 'Outro';

export const INVITE_TYPES = [
  'Aniversário infantil',
  'Aniversário adulto',
  'Casamento',
  'Chá de bebê / revelação',
  'Formatura',
  'Outro',
] as const;

export interface QuoteFormValues {
  servico: string;
  nome: string;
  idade: string;
  tema: string;
  tipoConvite: string;
  observacoes: string;
}

export type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;

export const EMPTY_QUOTE_FORM: QuoteFormValues = {
  servico: '',
  nome: '',
  idade: '',
  tema: '',
  tipoConvite: '',
  observacoes: '',
};

export function validateQuoteForm(values: QuoteFormValues, isInvite: boolean): QuoteFormErrors {
  const errors: QuoteFormErrors = {};

  if (!values.servico) errors.servico = 'Escolha o serviço que você procura.';
  if (!values.nome.trim()) errors.nome = 'Informe seu nome ou o nome da sua empresa.';

  const idade = values.idade.trim();
  if (isInvite && idade) {
    const idadeNumero = Number(idade);
    if (!Number.isInteger(idadeNumero) || idadeNumero < 0 || idadeNumero > 120) {
      errors.idade = 'Informe uma idade válida entre 0 e 120 anos.';
    }
  }

  return errors;
}

export function buildQuoteMessage(values: QuoteFormValues, isInvite: boolean): string {
  const lines = ['Olá! Gostaria de um orçamento da XFLO.', '', `Serviço: ${values.servico}`, `Nome ou empresa: ${values.nome.trim()}`];

  if (isInvite) {
    if (values.idade.trim()) lines.push(`Idade de quem será homenageado: ${values.idade.trim()}`);
    if (values.tema.trim()) lines.push(`Tema: ${values.tema.trim()}`);
    if (values.tipoConvite) lines.push(`Tipo de convite: ${values.tipoConvite}`);
  }

  if (values.observacoes.trim()) lines.push(`Observações: ${values.observacoes.trim()}`);

  return lines.join('\n');
}
