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
  fontSize: number; // 6-12
}
