import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import AboutSection from '@/components/home/AboutSection';
import HeroSection from '@/components/home/HeroSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import QuoteSection from '@/components/home/QuoteSection';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { useSiteSettings } from '@/contexts/siteSettingsContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchServices, fetchTestimonials } from '@/lib/publicContent';

export default function HomePage() {
  const { settings } = useSiteSettings();
  const testimonials = useAsyncData(fetchTestimonials);
  const testimonialList = testimonials.status === 'ready' ? (testimonials.data ?? []) : [];
  const hasTestimonials = testimonialList.length > 0;
  const services = useAsyncData(fetchServices);
  const serviceList = services.status === 'ready' ? (services.data ?? []) : [];

  return (
    <>
      <SiteHeader showTestimonials={hasTestimonials} />
      <main>
        <HeroSection whatsapp={settings?.whatsapp} imageUrl={settings?.imagem_hero} />
        <ServicesSection services={serviceList} />
        <PortfolioSection />
        {hasTestimonials && <TestimonialsSection testimonials={testimonialList} />}
        <QuoteSection services={serviceList} />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  );
}
