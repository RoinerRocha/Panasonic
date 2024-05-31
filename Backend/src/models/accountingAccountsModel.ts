import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";

class accountingAccountsModel extends Model {
    public id!: number;
    public codigoCuenta!: number;
    public nombreCuentaPrincipal!: string;
    public gastos!: number;
    public nombreCuentaGastos!: string;
    public depreciacion!: number;
    public nombreCuentadDepreciacion!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

try {
    accountingAccountsModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        codigoCuenta: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        nombreCuentaPrincipal: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        gastos: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        nombreCuentaGastos: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        depreciacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nombreCuentadDepreciacion: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
      },
      {
        sequelize,
  
        tableName: "CuentasContables",
        schema: "panasonic",
      }
    );
  } catch (error: any) {
    console.log("error en model CuentasContables: " + error.message);
  }
  sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Unable to connect to the database:", error));
  
  export default accountingAccountsModel;
  