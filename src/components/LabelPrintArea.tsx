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
        JsBarcode(barcodeRef.current, article.codigoBarra, {
          format: 'EAN13',
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

  const fs = settings.fontSize;

  return (
    <div className="label-single" style={{ fontFamily: 'Arial, sans-serif', color: '#000', background: '#fff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <div>
          {settings.showStoreName && settings.storeName && (
            <p style={{ fontSize: `${fs - 1}pt`, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
              {settings.storeName}
            </p>
          )}
          {settings.showArticulo && (
            <p style={{ fontSize: `${fs}pt`, fontWeight: 500, margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {article.articulo}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {settings.showTalle && article.talle && (
              <span style={{ fontSize: `${fs}pt`, fontWeight: 500 }}>T: {article.talle}</span>
            )}
            {settings.showPrecio && (
              <span style={{ fontSize: `${fs + 2}pt`, fontWeight: 'bold' }}>
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
