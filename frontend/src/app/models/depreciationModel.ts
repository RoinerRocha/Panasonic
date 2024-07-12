export interface depreciationModel {
    id: number;
    Codigo: string;
    Cuenta: string;
    Dolares: number;
    Colones: number;
    Clasificacion: string;
}

export interface depreciationFormModel {
    id: number;
    Codigo: string;
    Cuenta: string;
    Dolares: string; // Aquí es string en lugar de number
    Colones: string; // Aquí es string en lugar de number
    Clasificacion: string;
}