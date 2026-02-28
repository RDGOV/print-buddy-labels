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
        JsBarcode(barcodeRef.current, article.codigoBarra, {
          format: 'EAN13',
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

  const fs = settings.fontSize;

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
        <div className="space-y-0">
          {settings.showStoreName && settings.storeName && (
            <p className="font-bold text-center uppercase tracking-wider" style={{ fontSize: `${fs - 1}px` }}>
              {settings.storeName}
            </p>
          )}
          {settings.showArticulo && (
            <p className="truncate font-medium" style={{ fontSize: `${fs}px` }}>
              {article.articulo}
            </p>
          )}
          <div className="flex justify-between items-center">
            {settings.showTalle && article.talle && (
              <span className="font-medium" style={{ fontSize: `${fs}px` }}>
                T: {article.talle}
              </span>
            )}
            {settings.showPrecio && (
              <span className="font-bold" style={{ fontSize: `${fs + 2}px` }}>
                {formatPriceAR(article.precioVenta)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom: barcode */}
        {settings.showBarcode && (
          <div className="flex justify-center">
            <svg ref={barcodeRef} />
          </div>
        )}
      </div>
    </div>
  );
}
