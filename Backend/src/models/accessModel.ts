import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class NewAccesModel extends Model {
    public id!: number;
    public Acceso!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    NewAccesModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Acceso: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
    },
    {
      sequelize,
      tableName: "Accesos",
      schema: "panasonic",
    }
  );
} catch (error: any) {
    console.log("error en model Acces: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
  export default NewAccesModel;