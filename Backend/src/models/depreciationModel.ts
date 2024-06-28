import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class depreciationModel extends Model {
    public id!: number;
    public Codigo!: string;
    public Cuenta!: string | null;
    public Dolares!: number;
    public Colones!: number;
    public Clasificacion!: string | null;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    depreciationModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Codigo: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        Cuenta: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        Descripcion: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        Dolares: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
        Colones: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        Clasificacion: {
          type: DataTypes.STRING(1),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Depreciaciones",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model de depreciaciones: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
export default depreciationModel;