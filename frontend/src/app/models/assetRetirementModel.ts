export interface assetRetirementModel {
  id: number;
  PlacaActivo: string;
  DocumentoAprobado: Buffer | null;
  Descripcion: string;
  DestinoFinal: string;
  Fotografia: Buffer | null;
  NumeroBoleta: string;
  Usuario: string;
}
