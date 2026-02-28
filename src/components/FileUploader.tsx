import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploaderProps {
  onFileLoaded: (file: File) => void;
}

export function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
      setFileName(file.name);
      onFileLoaded(file);
    }
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-all duration-300
        ${dragOver
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : fileName
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }
      `}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.xlsx,.xls';
        input.onchange = (e) => {
          const f = (e.target as HTMLInputElement).files?.[0];
          if (f) handleFile(f);
        };
        input.click();
      }}
    >
      {fileName ? (
        <div className="flex items-center justify-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-accent" />
          <div className="text-left">
            <p className="font-semibold text-foreground">{fileName}</p>
            <p className="text-sm text-muted-foreground">Archivo cargado correctamente</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Arrastrá tu archivo aquí</p>
            <p className="text-sm text-muted-foreground">CSV o XLSX • Click para seleccionar</p>
          </div>
        </div>
      )}
    </div>
  );
}
