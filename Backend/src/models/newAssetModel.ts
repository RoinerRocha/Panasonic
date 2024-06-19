import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class NewAssetModel extends Model {
    public id!: number;
    public CodigoCuenta!: number;
    public Zona!: string;
    public Tipo!: string;
    public Estado!: string;
    public Descripcion!: string;
    public NumeroPlaca!: number;
    public ValorCompraCRC!: string;
    public ValorCompraUSD!: string;
    public Fotografia!: string | null;
    public NombreProveedor!: string;
    public FechaCompra!: Date;
    public FacturaNum!: number;
    public FacturaImagen!: string | null;
    public OrdenCompraNum!: number;
    public OrdenCompraImagen!: string | null;
    public NumeroAsiento!: number;
    public NumeroBoleta!: string;
    public Usuario!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    NewAssetModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        CodigoCuenta: {
          type: DataTypes.INTEGER,
          allowNull:false,
        },
        Zona: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        Tipo: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        Estado: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        Descripcion: {
          type: DataTypes.STRING(150),
          unique: true,
          allowNull: false,
        },
        NumeroPlaca: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ValorCompraCRC: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        ValorCompraUSD: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        Fotografia: {
          type: DataTypes.STRING(250),
          allowNull: true,
        },
        NombreProveedor: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        FechaCompra: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        FacturaNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        FacturaImagen: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        OrdenCompraNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        OrdenCompraImagen: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        NumeroAsiento: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        NumeroBoleta: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Usuario: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        
    },
    {
      sequelize,

      tableName: "NuevoActivo",
      schema: "panasonic",
    }
  );
} catch (error: any) {
    console.log("error en model newAsset: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
  export default NewAssetModel;