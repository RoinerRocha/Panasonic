export interface depreciationModel {
    id: number;
    CodCuenta: number; //codigo cuenta
    ActivoFijo: string; //nombre del activo. ejm: Edificio
    CodCuentaGasto: number; //codigo cuenta Gasto
    GastoCuenta: string; // nombre de la cuenta de gasto. ejm: equipo de computo
    CodCuentaDepAcumulada: number; //codigo cuenta depeciacion acumulada
    DepAcumulada: string; //nombre de la cuenta de depreciacion acumulada. ejm: Mobiliario General
    Detalle: string; // nombre el activo. ejm: silla, escritorio. ect..
    Dolares: number; // precio en colones
    Colones: number; //precio en dolares
    FechaCompra: Date;
    VidaUtil: number;
    TotalCuotas: number; //en meses
    CuotaConsumidas: string;
    Gap: string;
    CuotasDepreciadas: string;
    CuotasPendiente: string;
    DepreciacionXmesCRC: string;
    DepreciacionXmesUSD: string;
    DepreciacionDelMesCRC: string;
    DepreciacionDelMesUSD: string;
    DepreciacionAcumuladaCRC: string;
    DepreciacionAcumuladaUSD: string;
    ValorEnLibroCRC: string;
    ValorEnLibroUSD: string;
    ValorRescateCRC: string;
    ValorRescateUSD: string;
    Fecha:Date;// aqui va la fecha de cierre. o  fecha que se hace la depreciacion
    
}

export interface depreciationFormModel { // esto no se si se va autilizar.
    id: number;
    Codigo: string;
    Cuenta: string;
    Dolares: string; // Aquí es string en lugar de number
    Colones: string; // Aquí es string en lugar de number
    Clasificacion: string;
}