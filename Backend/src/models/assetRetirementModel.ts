import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class assetRetirementModel extends Model {
    public id!: number;
    public PlacaActivo!: string;
    public DocumentoAprobado!: string | null;
    public Descripcion!: string;
    public DestinoFinal!: string;
    public Fotografia!: string | null;
    public NumeroBoleta!: string;
    public Usuario!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    assetRetirementModel.init(
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
          allowNull: false,
        },
        Descripcion: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        DestinoFinal: {
            type: DataTypes.STRING(150),
            allowNull: false,
          },
        Fotografia: {
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
  
        tableName: "BajaActivo",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model baja activos: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
export default assetRetirementModel;