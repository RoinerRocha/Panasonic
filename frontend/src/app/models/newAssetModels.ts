export interface newAssetModels {
  id: number;
  Zona: number;
  Tipo: number;
  Estado: number;
  Descripcion: string;
  NumeroPlaca: number;
  ValorCompra: string;
  Fotografia: Buffer | null;
  NombreProveedor: string;
  FechaCompra: Date;
  FacturaNum: number;
  FacturaImagen: Buffer | null;
  OrdenCompraNum: number;
  OrdenCompraImagen: Buffer | null;
  NumeroAsiento: number;
  NumeroBoleta: string;
  Usuario: string;
}
