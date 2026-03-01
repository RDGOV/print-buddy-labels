import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { formatPriceAR } from '@/utils/formatPrice';
import type { Article } from '@/types/article';
import type { LabelSettings } from '@/types/article';

interface LabelPreviewProps {
  article: Article;
  settings: LabelSettings;
  scale?: number;
}

export function LabelPreview({ article, settings, scale = 2.5 }: LabelPreviewProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && settings.showBarcode && article.codigoBarra) {
      try {
        const code = article.codigoBarra.trim();
        const isEAN13 = /^\d{13}$/.test(code);
        JsBarcode(barcodeRef.current, code, {
          format: isEAN13 ? 'EAN13' : 'CODE128',
          width: 1.2,
          height: 28,
          displayValue: true,
          fontSize: 8,
          margin: 0,
          textMargin: 1,
          font: 'JetBrains Mono',
        });
      } catch {
        // Invalid barcode, show placeholder
        try {
          JsBarcode(barcodeRef.current, '0000000000000', {
            format: 'EAN13',
            width: 1.2,
            height: 28,
            displayValue: true,
            fontSize: 8,
            margin: 0,
            textMargin: 1,
          });
        } catch {
          // ignore
        }
      }
    }
  }, [article.codigoBarra, settings.showBarcode]);

  return (
    <div
      className="bg-white text-black border border-border rounded overflow-hidden flex-shrink-0"
      style={{
        width: `${57 * (scale / 2.5) * 2.5}mm`,
        height: `${31 * (scale / 2.5) * 2.5}mm`,
        padding: `${1 * scale}mm ${2 * scale}mm`,
        transform: `scale(${scale / 2.5})`,
        transformOrigin: 'top left',
      }}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Top: data */}
        <div className="space-y-0 flex flex-col justify-center flex-1">
          {settings.showStoreName && settings.storeName && (
            <p className={`text-center uppercase tracking-wider ${settings.storeNameBold ? 'font-bold' : ''}`} style={{ fontSize: `${settings.storeNameFontSize ?? 7}px` }}>
              {settings.storeName}
            </p>
          )}
          {settings.showArticulo && (
            <p className={`truncate ${settings.articleBold ? 'font-bold' : 'font-medium'}`} style={{ fontSize: `${settings.articleFontSize ?? 8}px` }}>
              {article.articulo}
            </p>
          )}
          <div className={`flex ${settings.tallePrecioLayout === 'column' ? 'flex-col items-start gap-1' : 'justify-between items-center'}`}>
            {settings.showTalle && article.talle && (
              <span className={settings.talleBold ? 'font-bold' : 'font-medium'} style={{ fontSize: `${settings.talleFontSize ?? 8}px` }}>
                T: {article.talle}
              </span>
            )}
            {settings.showPrecio && (
              <span className={settings.precioBold ? 'font-bold' : 'font-medium'} style={{ fontSize: `${settings.precioFontSize ?? 10}px` }}>
                {formatPriceAR(article.precioVenta)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom: barcode */}
        {settings.showBarcode && (
          <div className="flex justify-center flex-1 items-end min-h-0">
            <svg ref={barcodeRef} style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
          </div>
        )}
      </div>
    </div>
  );
}
