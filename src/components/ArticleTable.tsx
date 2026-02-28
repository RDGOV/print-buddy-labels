import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { formatPriceAR } from '@/utils/formatPrice';
import type { Article } from '@/types/article';

interface ArticleTableProps {
  articles: Article[];
  onUpdate: (articles: Article[]) => void;
}

export function ArticleTable({ articles, onUpdate }: ArticleTableProps) {
  const toggleSelect = (id: string) => {
    onUpdate(articles.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const toggleAll = (checked: boolean) => {
    onUpdate(articles.map(a => ({ ...a, selected: checked })));
  };

  const updateQty = (id: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    onUpdate(articles.map(a => a.id === id ? { ...a, cantidadImprimir: num } : a));
  };

  const allSelected = articles.every(a => a.selected);
  const totalLabels = articles.filter(a => a.selected).reduce((sum, a) => sum + a.cantidadImprimir, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {articles.filter(a => a.selected).length} de {articles.length} seleccionados
        </p>
        <p className="text-sm font-mono font-semibold text-primary">
          {totalLabels} etiquetas totales
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 w-10">
                  <Checkbox checked={allSelected} onCheckedChange={(c) => toggleAll(!!c)} />
                </th>
                <th className="p-3 text-left font-semibold text-muted-foreground">Artículo</th>
                <th className="p-3 text-left font-semibold text-muted-foreground">Código</th>
                <th className="p-3 text-left font-semibold text-muted-foreground">Talle</th>
                <th className="p-3 text-right font-semibold text-muted-foreground">Precio</th>
                <th className="p-3 text-center font-semibold text-muted-foreground">Stock</th>
                <th className="p-3 text-center font-semibold text-muted-foreground">Etiquetas</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr
                  key={art.id}
                  className={`border-b last:border-0 transition-colors ${art.selected ? 'bg-card' : 'bg-muted/30 opacity-60'}`}
                >
                  <td className="p-3">
                    <Checkbox checked={art.selected} onCheckedChange={() => toggleSelect(art.id)} />
                  </td>
                  <td className="p-3 font-medium max-w-[200px] truncate">{art.articulo}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{art.codigoBarra}</td>
                  <td className="p-3">{art.talle}</td>
                  <td className="p-3 text-right font-mono font-semibold">{formatPriceAR(art.precioVenta)}</td>
                  <td className="p-3 text-center text-muted-foreground">{art.cantidad}</td>
                  <td className="p-3 text-center">
                    <Input
                      type="number"
                      min={0}
                      value={art.cantidadImprimir}
                      onChange={(e) => updateQty(art.id, e.target.value)}
                      className="w-16 text-center mx-auto h-8 font-mono"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
