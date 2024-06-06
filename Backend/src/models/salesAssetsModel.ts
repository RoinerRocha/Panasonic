import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class SalesAssetsModel extends Model {
    public id!: number;
    public PlacaActivo!: string;
    public DocumentoAprobado!: Buffer | null;
    public Descripcion!: string;
    public MontoVentas!: number;
    public CotizacionVentas!: Buffer | null;
    public Fotografia!: Buffer | null;
    public Comprobante!: Buffer | null;
    public NumeroBoleta!: string;
    public Usuario!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    SalesAssetsModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        PlacaActivo: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        DocumentoAprobado: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        Descripcion: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        MontoVentas: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CotizacionVentas: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        Fotografia: {
          type: DataTypes.BLOB,
          allowNull: true,
        },
        Comprobante: {
            type: DataTypes.BLOB,
            allowNull: true,
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
  
        tableName: "VentaActivo",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model zonas: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
export default SalesAssetsModel;