import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class ZonaModels extends Model {
  public id!: number;
  public numeroZona!: string;
  public nombreZona!: string;
  public responsableAreaNom_user!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

try {
  ZonaModels.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      numeroZona: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nombreZona: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      responsableAreaNom_user: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    {
      sequelize,

      tableName: "Zonas",
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

export default ZonaModels;
