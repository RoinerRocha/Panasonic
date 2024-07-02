export interface assetSaleModel {
  id: number;
  Descripcion: string;
  DocumentoAprobado: File | null;
  MontoVentas: number;
  PlacaActivo: string;
  CotizacionVentas: File | null;
  Fotografia: File | null;
  Comprobante: File | null;
  NumeroBoleta: string;
  Usuario: string;
}
