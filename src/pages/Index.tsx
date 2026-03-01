import { useState, useMemo } from 'react';
import { Printer, Tag, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { ArticleTable } from '@/components/ArticleTable';
import { LabelPreview } from '@/components/LabelPreview';
import { LabelPrintArea } from '@/components/LabelPrintArea';
import { SettingsPanel } from '@/components/SettingsPanel';
import { parseFileToArticles } from '@/utils/parseFile';
import type { Article, LabelSettings } from '@/types/article';
import { toast } from 'sonner';

const defaultSettings: LabelSettings = {
  storeName: '',
  showStoreName: true,
  showArticulo: true,
  showTalle: true,
  showPrecio: true,
  showBarcode: true,
  fontSize: 8,
  storeNameFontSize: 7,
  articleFontSize: 8,
  talleFontSize: 8,
  precioFontSize: 10,
  storeNameBold: true,
  articleBold: false,
  talleBold: true,
  precioBold: true,
  tallePrecioLayout: 'row',
};

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<LabelSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const parsed = await parseFileToArticles(file);
      setArticles(parsed);
      toast.success(`${parsed.length} artículos cargados`);
    } catch {
      toast.error('Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const selected = articles.filter(a => a.selected && a.cantidadImprimir > 0);
    if (selected.length === 0) {
      toast.error('No hay etiquetas seleccionadas para imprimir');
      return;
    }
    window.print();
  };

  const previewArticle = useMemo(() => {
    const selected = articles.find(a => a.selected);
    return selected || (articles.length > 0 ? articles[0] : null);
  }, [articles]);

  const totalLabels = articles.filter(a => a.selected).reduce((sum, a) => sum + a.cantidadImprimir, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Etiquetas Térmicas</h1>
              <p className="text-xs text-muted-foreground">57 × 31mm</p>
            </div>
          </div>

          {articles.length > 0 && (
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimir {totalLabels > 0 && `(${totalLabels})`}
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Upload */}
        <FileUploader onFileLoaded={handleFile} />

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Procesando archivo...
          </div>
        )}

        {articles.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table */}
            <div className="lg:col-span-2">
              <ArticleTable articles={articles} onUpdate={setArticles} />
            </div>

            {/* Sidebar: settings + preview */}
            <div className="space-y-6">
              <SettingsPanel settings={settings} onChange={setSettings} />

              {/* Preview */}
              {previewArticle && (
                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">Vista previa</h3>
                  <div className="flex justify-center overflow-hidden rounded-lg bg-muted/50 p-4">
                    <div style={{ width: '57mm', height: '31mm' }}>
                      <LabelPreview article={previewArticle} settings={settings} scale={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Tamaño real: 57 × 31mm
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {articles.length === 0 && !loading && (
          <div className="text-center py-16 space-y-4">
            <PackageOpen className="w-16 h-16 mx-auto text-muted-foreground/40" />
            <div>
              <p className="text-lg font-medium text-muted-foreground">Cargá tu archivo para comenzar</p>
              <p className="text-sm text-muted-foreground/70">Aceptamos archivos CSV y Excel (.xlsx)</p>
            </div>
          </div>
        )}
      </main>

      {/* Hidden print area */}
      <LabelPrintArea articles={articles} settings={settings} />
    </div>
  );
};

export default Index;
