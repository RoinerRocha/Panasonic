import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class serviceLifeModels extends Model {
    public id!: number;
    public tipo!: string;
    public añoUtil!: number;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


try {
    serviceLifeModels.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        tipo: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        añoUtil: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
  
        tableName: "VidaUtil",
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
  
export default serviceLifeModels;