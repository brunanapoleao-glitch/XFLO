import { useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import StatusBanner from '@/components/ui/StatusBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { updateHeroImage, uploadPortfolioImage } from '@/lib/adminContent';
import { fetchSettings } from '@/lib/publicContent';

type Feedback = { tone: 'success' | 'error'; message: string } | null;

export default function AdminHeroPhotoSection() {
  const { data: settings, status, reload } = useAsyncData(fetchSettings);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (status === 'loading') {
    return <div className="h-96 animate-pulse rounded-3xl bg-night" aria-busy="true" aria-label="Carregando foto" />;
  }

  if (status === 'error' || !settings) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
        <p className="text-mist-muted">Não foi possível carregar a foto principal.</p>
        <Button variant="secondary" onClick={reload}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setFeedback(null);
  };

  const handleSave = async () => {
    if (!file) {
      setFeedback({ tone: 'error', message: 'Escolha uma foto antes de salvar.' });
      return;
    }

    setBusy(true);
    setFeedback(null);
    try {
      const newUrl = await uploadPortfolioImage(file);
      await updateHeroImage(settings.imagem_hero, newUrl);
      setFile(null);
      setFeedback({ tone: 'success', message: 'Foto atualizada. O topo do site já mostra a nova imagem.' });
      reload();
    } catch (caught) {
      setFeedback({
        tone: 'error',
        message: caught instanceof Error ? caught.message : 'Não foi possível salvar a foto.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex flex-col gap-8 rounded-3xl border border-brand-deep/30 bg-night p-6 sm:p-8" aria-label="Foto principal">
      <div>
        <h2 className="text-lg font-semibold text-mist">Foto principal</h2>
        <p className="mt-1 text-sm text-mist-muted">
          Esta é a foto que aparece ao lado do texto de apresentação, no topo da página inicial.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-mist">Foto atual</span>
          <img
            src={previewUrl ?? settings.imagem_hero}
            alt={previewUrl ? 'Pré-visualização da nova foto principal' : 'Foto principal atual do site'}
            className="aspect-[4/5] w-full rounded-2xl border border-brand-deep/30 object-cover object-top"
          />
          {previewUrl && <p className="text-xs text-mist-muted">Esta é uma prévia. A foto só muda ao salvar.</p>}
        </div>

        <div className="flex flex-col gap-4">
          <input
            id="hero-imagem"
            type="file"
            accept="image/*"
            className="peer sr-only"
            onChange={handleFileChange}
          />
          <label
            htmlFor="hero-imagem"
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-brand/60 bg-night-2 px-4 py-3 text-sm font-semibold text-brand-glow transition hover:border-brand-glow hover:bg-night peer-focus-visible:ring-2 peer-focus-visible:ring-brand-glow peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-night"
          >
            <ImagePlus size={16} aria-hidden="true" />
            {file ? `Trocar escolha (${file.name})` : 'Escolher nova foto'}
          </label>
          <p className="text-xs text-mist-muted">
            JPG, PNG ou WebP até 8 MB. Use uma foto na vertical, de preferência com a pessoa centralizada. A foto é otimizada
            automaticamente.
          </p>

          {feedback && <StatusBanner tone={feedback.tone} message={feedback.message} />}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={busy || !file} aria-busy={busy} className="w-full sm:w-auto">
              <Save size={16} aria-hidden="true" />
              {busy ? 'Salvando...' : 'Salvar foto'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
