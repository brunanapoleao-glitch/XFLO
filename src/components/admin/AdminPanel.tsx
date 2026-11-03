import { useState } from 'react';
import { BadgeDollarSign, Camera, Images, LogOut, MessageSquareQuote, Sparkles } from 'lucide-react';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';
import AdminHeroPhotoSection from '@/components/admin/AdminHeroPhotoSection';
import AdminServicesSection from '@/components/admin/AdminServicesSection';
import AdminPortfolioSection from '@/components/admin/AdminPortfolioSection';
import AdminTestimonialsSection from '@/components/admin/AdminTestimonialsSection';
import StatusBanner from '@/components/ui/StatusBanner';
import { Button } from '@/components/ui/Button';
import { XfloWordmark } from '@/components/ui/XfloLogo';
import { signOutAdmin } from '@/lib/adminAuth';

type AdminTab = 'configuracoes' | 'foto' | 'servicos' | 'portfolio' | 'depoimentos';

const TABS: { id: AdminTab; label: string; icon: typeof Images }[] = [
  { id: 'configuracoes', label: 'Configurações', icon: BadgeDollarSign },
  { id: 'foto', label: 'Foto principal', icon: Camera },
  { id: 'servicos', label: 'Serviços', icon: Sparkles },
  { id: 'portfolio', label: 'Portfólio', icon: Images },
  { id: 'depoimentos', label: 'Depoimentos', icon: MessageSquareQuote },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('configuracoes');
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

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

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-5xl flex-col gap-8 px-5 pb-32 pt-8 sm:px-8 sm:pt-12">
      <header className="flex flex-col gap-6 border-b border-brand-deep/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <a href="/" aria-label="Voltar para o site" className="w-fit rounded-lg">
            <XfloWordmark />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-mist">Painel do administrador</h1>
            <p className="text-sm text-mist-muted">Alterações aparecem no site assim que forem salvas.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <Button variant="secondary" onClick={handleSignOut} disabled={signingOut} className="w-full sm:w-auto">
            <LogOut size={16} aria-hidden="true" />
            {signingOut ? 'Saindo...' : 'Sair'}
          </Button>
          {signOutError && <StatusBanner tone="error" message={signOutError} />}
        </div>
      </header>

      <nav aria-label="Seções do painel">
        <div role="tablist" className="flex gap-2 overflow-x-auto rounded-2xl border border-brand-deep/30 bg-night p-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-11 flex-1 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                  selected
                    ? 'bg-gradient-to-r from-brand-deep to-[#9333ea] text-white shadow-glow'
                    : 'text-mist-muted hover:bg-night-2 hover:text-mist'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="animate-fade-in"
      >
        {activeTab === 'configuracoes' && <AdminSettingsForm />}
        {activeTab === 'foto' && <AdminHeroPhotoSection />}
        {activeTab === 'servicos' && <AdminServicesSection />}
        {activeTab === 'portfolio' && <AdminPortfolioSection />}
        {activeTab === 'depoimentos' && <AdminTestimonialsSection />}
      </div>
    </div>
  );
}
