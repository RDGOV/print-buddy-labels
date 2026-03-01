export interface Article {
  id: string;
  articulo: string;
  codigoBarra: string;
  talle: string;
  precioVenta: number;
  cantidad: number;
  cantidadImprimir: number;
  selected: boolean;
}

export interface LabelSettings {
  storeName: string;
  showStoreName: boolean;
  showArticulo: boolean;
  showTalle: boolean;
  showPrecio: boolean;
  showBarcode: boolean;
  fontSize: number; // 6-12 (legacy global font size)

  // Individual font sizes
  storeNameFontSize: number;
  articleFontSize: number;
  talleFontSize: number;
  precioFontSize: number;

  // Individual bold styles
  storeNameBold: boolean;
  articleBold: boolean;
  talleBold: boolean;
  precioBold: boolean;

  // Layout preferences
  tallePrecioLayout: 'row' | 'column'; // 'row' = side by side, 'column' = stacked
}
