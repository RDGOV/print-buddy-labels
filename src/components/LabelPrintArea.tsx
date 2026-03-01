import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { formatPriceAR } from '@/utils/formatPrice';
import type { Article } from '@/types/article';
import type { LabelSettings } from '@/types/article';

interface PrintLabelProps {
  article: Article;
  settings: LabelSettings;
}

function PrintLabel({ article, settings }: PrintLabelProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && settings.showBarcode && article.codigoBarra) {
      try {
        const code = article.codigoBarra.trim();
        const isEAN13 = /^\d{13}$/.test(code);
        JsBarcode(barcodeRef.current, code, {
          format: isEAN13 ? 'EAN13' : 'CODE128',
          width: 1,
          height: 22,
          displayValue: true,
          fontSize: 7,
          margin: 0,
          textMargin: 0,
          font: 'monospace',
        });
      } catch {
        // skip invalid
      }
    }
  }, [article.codigoBarra, settings.showBarcode]);

  return (
    <div className="label-single" style={{ fontFamily: 'Arial, sans-serif', color: '#000', background: '#fff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {settings.showStoreName && settings.storeName && (
            <p style={{ fontSize: `${settings.storeNameFontSize ?? 7}pt`, fontWeight: settings.storeNameBold ? 'bold' : 'normal', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
              {settings.storeName}
            </p>
          )}
          {settings.showArticulo && (
            <p style={{ fontSize: `${settings.articleFontSize ?? 8}pt`, fontWeight: settings.articleBold ? 'bold' : 500, margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {article.articulo}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: settings.tallePrecioLayout === 'column' ? 'column' : 'row', justifyContent: settings.tallePrecioLayout === 'column' ? 'flex-start' : 'space-between', alignItems: settings.tallePrecioLayout === 'column' ? 'flex-start' : 'center', gap: settings.tallePrecioLayout === 'column' ? '2px' : '0' }}>
            {settings.showTalle && article.talle && (
              <span style={{ fontSize: `${settings.talleFontSize ?? 8}pt`, fontWeight: settings.talleBold ? 'bold' : 500 }}>T: {article.talle}</span>
            )}
            {settings.showPrecio && (
              <span style={{ fontSize: `${settings.precioFontSize ?? 10}pt`, fontWeight: settings.precioBold ? 'bold' : 500 }}>
                {formatPriceAR(article.precioVenta)}
              </span>
            )}
          </div>
        </div>
        {settings.showBarcode && (
          <div style={{ textAlign: 'center' }}>
            <svg ref={barcodeRef} />
          </div>
        )}
      </div>
    </div>
  );
}

interface LabelPrintAreaProps {
  articles: Article[];
  settings: LabelSettings;
}

export function LabelPrintArea({ articles, settings }: LabelPrintAreaProps) {
  const labels: { article: Article; index: number }[] = [];
  articles.filter(a => a.selected).forEach(art => {
    for (let i = 0; i < art.cantidadImprimir; i++) {
      labels.push({ article: art, index: i });
    }
  });

  if (labels.length === 0) return null;

  return (
    <div className="label-print-area" style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
      {labels.map((l, i) => (
        <PrintLabel key={`${l.article.id}-${l.index}-${i}`} article={l.article} settings={settings} />
      ))}
    </div>
  );
}
