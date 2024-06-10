export interface newAssetModels {
  id: number;
  Zona: string;
  Tipo: string;
  Estado: string;
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
