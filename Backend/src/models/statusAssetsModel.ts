import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class statusAssetsModel extends Model {
    public id!: number;
    public status!: string;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
try {
    statusAssetsModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
  
        tableName: "EstadoActivos",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model StatusAssets: " + error.message);
  }
  sequelize
  .sync()
  .then(() => console.log("Database & tables created!"))
  .catch((error) => console.error("Unable to connect to the database:", error));

export default statusAssetsModel;
