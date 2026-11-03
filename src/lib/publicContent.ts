import { supabase } from '@/lib/supabase';
import type { PortfolioItem, Service, SiteSettings, Testimonial } from '@/types/site';

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('whatsapp, instagram, preco_site, preco_convite, imagem_hero')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Configurações não encontradas.');

  return {
    whatsapp: String(data.whatsapp ?? ''),
    instagram: String(data.instagram ?? ''),
    preco_site: Number(data.preco_site),
    preco_convite: Number(data.preco_convite),
    imagem_hero: String(data.imagem_hero ?? ''),
  };
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('id, titulo, tipo, imagem_url, ordem, criado_em')
    .order('ordem', { ascending: true })
    .order('criado_em', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as PortfolioItem[];
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('servicos')
    .select('id, titulo, descricao, icone, tipo_preco, ordem, criado_em')
    .order('ordem', { ascending: true })
    .order('criado_em', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Service[];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('depoimentos')
    .select('id, nome, texto, nota, criado_em')
    .order('criado_em', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
}
