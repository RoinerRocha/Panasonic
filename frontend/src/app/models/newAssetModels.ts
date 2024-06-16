export interface newAssetModels {
  id: number;
  CodigoCuenta: number
  Zona: number;
  Tipo: number;
  Estado: number;
  Descripcion: string;
  NumeroPlaca: number;
  ValorCompraCRC: string;
  ValorCompraUSD: string;
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
