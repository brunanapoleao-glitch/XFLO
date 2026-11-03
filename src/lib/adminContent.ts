import { supabase } from '@/lib/supabase';
import type { PortfolioItem, ServicePricing, SiteSettings } from '@/types/site';

const PORTFOLIO_BUCKET = 'portfolio';
const PORTFOLIO_PUBLIC_PATH = `/object/public/${PORTFOLIO_BUCKET}/`;
const MAX_IMAGE_WIDTH = 1600;
const WEBP_QUALITY = 0.86;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type SettingsInput = Pick<SiteSettings, 'whatsapp' | 'instagram' | 'preco_site' | 'preco_convite'>;

export interface PortfolioInput {
  titulo: string;
  tipo: string;
  ordem: number;
}

export interface TestimonialInput {
  nome: string;
  texto: string;
  nota: number;
}

export interface ServiceInput {
  titulo: string;
  descricao: string;
  icone: string;
  tipo_preco: ServicePricing;
  ordem: number;
}

const NOT_SAVED_MESSAGE = 'Não foi possível salvar. Verifique se sua sessão de administrador está ativa.';

export async function updateSettings(values: SettingsInput): Promise<void> {
  const { data, error } = await supabase
    .from('settings')
    .update(values)
    .eq('id', 1)
    .select('id');

  if (error) throw new Error(NOT_SAVED_MESSAGE);
  if (!data?.length) throw new Error(NOT_SAVED_MESSAGE);
}

export async function updateHeroImage(previousUrl: string, newUrl: string): Promise<void> {
  const { data, error } = await supabase
    .from('settings')
    .update({ imagem_hero: newUrl })
    .eq('id', 1)
    .select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);

  if (previousUrl !== newUrl) {
    await removePortfolioImage(previousUrl);
  }
}

export async function createService(values: ServiceInput): Promise<void> {
  const { data, error } = await supabase.from('servicos').insert(values).select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);
}

export async function updateService(id: string, values: ServiceInput): Promise<void> {
  const { data, error } = await supabase.from('servicos').update(values).eq('id', id).select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);
}

export async function deleteService(id: string): Promise<void> {
  const { data, error } = await supabase.from('servicos').delete().eq('id', id).select('id');

  if (error || !data?.length) throw new Error('Não foi possível apagar o serviço.');
}

export async function createPortfolioItem(values: PortfolioInput, imagemUrl: string): Promise<void> {
  const { data, error } = await supabase
    .from('portfolio')
    .insert({ ...values, imagem_url: imagemUrl })
    .select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);
}

export async function updatePortfolioItem(
  item: PortfolioItem,
  values: PortfolioInput,
  newImageUrl?: string,
): Promise<void> {
  const payload = newImageUrl ? { ...values, imagem_url: newImageUrl } : values;
  const { data, error } = await supabase
    .from('portfolio')
    .update(payload)
    .eq('id', item.id)
    .select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);

  if (newImageUrl && newImageUrl !== item.imagem_url) {
    await removePortfolioImage(item.imagem_url);
  }
}

export async function deletePortfolioItem(item: PortfolioItem): Promise<void> {
  const { data, error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', item.id)
    .select('id');

  if (error || !data?.length) throw new Error('Não foi possível apagar o projeto.');

  await removePortfolioImage(item.imagem_url);
}

export async function createTestimonial(values: TestimonialInput): Promise<void> {
  const { data, error } = await supabase.from('depoimentos').insert(values).select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);
}

export async function updateTestimonial(id: string, values: TestimonialInput): Promise<void> {
  const { data, error } = await supabase
    .from('depoimentos')
    .update(values)
    .eq('id', id)
    .select('id');

  if (error || !data?.length) throw new Error(NOT_SAVED_MESSAGE);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('depoimentos')
    .delete()
    .eq('id', id)
    .select('id');

  if (error || !data?.length) throw new Error('Não foi possível apagar o depoimento.');
}

export async function uploadPortfolioImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Envie um arquivo de imagem (JPG, PNG ou WebP).');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('A imagem deve ter no máximo 8 MB.');
  }

  const optimized = await toOptimizedWebp(file);
  const path = `${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(path, optimized, { contentType: 'image/webp', cacheControl: '31536000' });

  if (error) throw new Error('Não foi possível enviar a imagem. Tente novamente.');

  return supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function removePortfolioImage(imageUrl: string): Promise<void> {
  const index = imageUrl.indexOf(PORTFOLIO_PUBLIC_PATH);
  if (index === -1) return;

  const path = decodeURIComponent(imageUrl.slice(index + PORTFOLIO_PUBLIC_PATH.length));
  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).remove([path]);

  if (error) throw new Error('O projeto foi apagado, mas a imagem não pôde ser removida.');
}

async function toOptimizedWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error('Não foi possível ler esta imagem.');

  const scale = Math.min(1, MAX_IMAGE_WIDTH / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Não foi possível processar a imagem.');

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY),
  );
  if (!blob) throw new Error('Não foi possível processar a imagem.');

  return blob;
}
