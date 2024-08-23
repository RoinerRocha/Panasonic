export interface newAssetModels {
  id: number;
  CodigoCuenta: number;
  Zona: string | number;
  Tipo: string | number;
  Estado: string | number;
  Descripcion: string;
  NumeroPlaca: number;
  ValorCompraCRC: string;
  ValorCompraUSD: string;
  Fotografia: File | null;
  NombreProveedor: string;
  FechaCompra: Date;
  FacturaNum: number;
  FacturaImagen: File | null;
  OrdenCompraNum: number;
  OrdenCompraImagen: File | null;
  NumeroAsiento: number;
  NumeroBoleta: string;
  Usuario: string;
}

