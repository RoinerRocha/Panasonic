import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class EditAssetModel extends Model {
    public id!: number;
    public PlacaActivo!: string;
    public Descripcion!: string;
    public Fotografia!: Buffer | null;
    public NumeroBoleta!: string;
    public Usuario!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    EditAssetModel.init(
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
        Descripcion: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        Fotografia: {
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
  
        tableName: "ActivoEditado",
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
  
export default EditAssetModel;