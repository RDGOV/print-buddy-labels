import * as XLSX from 'xlsx';
import type { Article } from '@/types/article';

export function parseFileToArticles(file: File): Promise<Article[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        const articles: Article[] = rows.map((row, i) => {
          const codigoBarra = String(findColumn(row, ['codigo de barra', 'código de barra', 'codigo_de_barra', 'barcode', 'ean']) || '');
          const talle = String(findColumn(row, ['talle', 'size', 'talla']) || '');
          const articulo = String(findColumn(row, ['artículo', 'articulo', 'article', 'producto', 'descripcion', 'descripción']) || '');
          const cantidad = Number(findColumn(row, ['cantidad', 'qty', 'quantity']) || 1);
          const precioVenta = Number(findColumn(row, ['precio de venta', 'precio_de_venta', 'precio venta', 'precioventa', 'price', 'precio']) || 0);

          return {
            id: `art-${i}`,
            articulo,
            codigoBarra,
            talle,
            precioVenta,
            cantidad,
            cantidadImprimir: cantidad,
            selected: true,
          };
        });

        resolve(articles.filter(a => a.codigoBarra || a.articulo));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

function findColumn(row: Record<string, unknown>, possibleNames: string[]): unknown {
  for (const key of Object.keys(row)) {
    const normalized = key.toLowerCase().trim();
    if (possibleNames.some(name => normalized.includes(name))) {
      return row[key];
    }
  }
  return undefined;
}
