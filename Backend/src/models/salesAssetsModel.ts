import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class SalesAssetsModel extends Model {
    public id!: number;
    public PlacaActivo!: string;
    public DocumentoAprobado!: string | null;
    public Descripcion!: string;
    public MontoVentas!: number;
    public CotizacionVentas!: string | null;
    public Fotografia!: string | null;
    public Comprobante!: string | null;
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
            type: DataTypes.STRING(250),
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
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        Fotografia: {
          type: DataTypes.STRING(250),
          allowNull: true,
        },
        Comprobante: {
            type: DataTypes.STRING(250),
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
        tableName: "VentaActivos",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model ventaActivos: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
export default SalesAssetsModel;