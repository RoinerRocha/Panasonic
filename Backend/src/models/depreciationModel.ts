import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class DepreciationModel extends Model {
  public id!: number;
  public CodCuenta!: number; // código cuenta
  public ActivoFijo!: string; // nombre del activo. ejm: Edificio
  public CodCuentaGasto!: number; // código cuenta Gasto
  public GastoCuenta!: string; // nombre de la cuenta de gasto. ejm: equipo de computo
  public CodCuentaDepAcumulada!: number; // código cuenta depreciación acumulada
  public DepAcumulada!: string; // nombre de la cuenta de depreciación acumulada. ejm: Mobiliario General
  public Detalle!: string; // nombre del activo. ejm: silla, escritorio, etc.
  public Dolares!: number; // precio en dólares
  public Colones!: number; // precio en colones
  public FechaCompra!: Date;
  public VidaUtil!: number;
  public TotalCuotas!: number; // en meses
  public CuotaConsumidas!: string;
  public Gap!: string;
  public CuotasDepreciadas!: string;
  public CuotasPendiente!: string;
  public DepreciacionXmesCRC!: string;
  public DepreciacionXmesUSD!: string;
  public DepreciacionDelMesCRC!: string;
  public DepreciacionDelMesUSD!: string;
  public DepreciacionAcumuladaCRC!: string;
  public DepreciacionAcumuladaUSD!: string;
  public ValorEnLibroCRC!: string;
  public ValorEnLibroUSD!: string;
  public ValorRescateCRC!: string;
  public ValorRescateUSD!: string;
  public Fecha!: Date; // fecha de cierre o fecha que se hace la depreciación
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

try {
  DepreciationModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CodCuenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ActivoFijo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CodCuentaGasto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      GastoCuenta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CodCuentaDepAcumulada: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      DepAcumulada: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Detalle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Dolares: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Colones: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      FechaCompra: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      VidaUtil: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TotalCuotas: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      CuotaConsumidas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Gap: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CuotasDepreciadas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CuotasPendiente: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DepreciacionXmesCRC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DepreciacionXmesUSD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DepreciacionDelMesCRC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DepreciacionDelMesUSD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DepreciacionAcumuladaCRC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DepreciacionAcumuladaUSD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ValorEnLibroCRC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ValorEnLibroUSD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ValorRescateCRC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ValorRescateUSD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Depreciaciones",
      schema: "panasonic",
    }
  );
} catch (error: any) {
  console.log("error en model de depreciaciones: " + error.message);
}

sequelize
  .sync()
  .then(() => console.log("Database & tables created!"))
  .catch((error) => console.error("Unable to connect to the database:", error));

export default DepreciationModel;
