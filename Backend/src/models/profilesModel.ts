import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class profileModels extends Model {
    public id!: number;
    public nombre!: string;
    public permisoAcceso!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    profileModels.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        permisoAcceso: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
  
        tableName: "Perfiles",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model profile: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
export default profileModels;