import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';
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

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Tamaño de fuente ({settings.fontSize}pt)</Label>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([v]) => update({ fontSize: v })}
            min={5}
            max={14}
            step={1}
          />
        </div>

        <div className="space-y-3 pt-1">
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
      </div>
    </div>
  );
}
