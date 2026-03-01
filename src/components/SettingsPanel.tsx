import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { LabelSettings } from '@/types/article';

interface SettingsPanelProps {
  settings: LabelSettings;
  onChange: (settings: LabelSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const update = (partial: Partial<LabelSettings>) => onChange({ ...settings, ...partial });

  return (
    <div className="rounded-xl border bg-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Personalización</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Nombre de tienda</Label>
          <Input
            value={settings.storeName}
            onChange={(e) => update({ storeName: e.target.value })}
            placeholder="Mi Tienda"
            className="h-9"
          />
        </div>

        <Accordion type="single" collapsible defaultValue="visibility" className="w-full">
          <AccordionItem value="visibility">
            <AccordionTrigger className="text-sm font-medium">Visibilidad</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {[
                  { key: 'showStoreName' as const, label: 'Mostrar nombre tienda' },
                  { key: 'showArticulo' as const, label: 'Mostrar artículo' },
                  { key: 'showTalle' as const, label: 'Mostrar talle' },
                  { key: 'showPrecio' as const, label: 'Mostrar precio' },
                  { key: 'showBarcode' as const, label: 'Mostrar código de barras' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="text-sm">{label}</Label>
                    <Switch
                      checked={settings[key]}
                      onCheckedChange={(c) => update({ [key]: c })}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="appearance">
            <AccordionTrigger className="text-sm font-medium">Apariencia y tamaños</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {settings.showStoreName && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">Tienda ({settings.storeNameFontSize}pt)</Label>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Negrita</Label>
                        <Switch
                          checked={settings.storeNameBold}
                          onCheckedChange={(c) => update({ storeNameBold: c })}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[settings.storeNameFontSize ?? 7]}
                      onValueChange={([v]) => update({ storeNameFontSize: v })}
                      min={5} max={16} step={1}
                    />
                  </div>
                )}

                {settings.showArticulo && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">Artículo ({settings.articleFontSize}pt)</Label>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Negrita</Label>
                        <Switch
                          checked={settings.articleBold}
                          onCheckedChange={(c) => update({ articleBold: c })}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[settings.articleFontSize ?? 8]}
                      onValueChange={([v]) => update({ articleFontSize: v })}
                      min={5} max={16} step={1}
                    />
                  </div>
                )}

                {settings.showTalle && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">Talle ({settings.talleFontSize}pt)</Label>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Negrita</Label>
                        <Switch
                          checked={settings.talleBold}
                          onCheckedChange={(c) => update({ talleBold: c })}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[settings.talleFontSize ?? 8]}
                      onValueChange={([v]) => update({ talleFontSize: v })}
                      min={5} max={16} step={1}
                    />
                  </div>
                )}

                {settings.showPrecio && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">Precio ({settings.precioFontSize}pt)</Label>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Negrita</Label>
                        <Switch
                          checked={settings.precioBold}
                          onCheckedChange={(c) => update({ precioBold: c })}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[settings.precioFontSize ?? 10]}
                      onValueChange={([v]) => update({ precioFontSize: v })}
                      min={5} max={20} step={1}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {(settings.showTalle || settings.showPrecio) && (
            <AccordionItem value="layout">
              <AccordionTrigger className="text-sm font-medium">Disposición</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Formato de Talle y Precio</Label>
                    <Select
                      value={settings.tallePrecioLayout ?? 'row'}
                      onValueChange={(v: 'row' | 'column') => update({ tallePrecioLayout: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Lado a lado (Fila)</SelectItem>
                        <SelectItem value="column">Uno sobre otro (Columna)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
}
