export interface assetRetirementModel {
  id: number;
  PlacaActivo: string | number;
  DocumentoAprobado: File | null;
  Descripcion: string;
  DestinoFinal: string;
  Fotografia: File | null;
  NumeroBoleta: string;
  Usuario: string;
}
