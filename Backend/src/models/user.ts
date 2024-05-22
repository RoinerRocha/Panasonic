import { Model, DataTypes } from "sequelize";
import sequelize from "../Services/Postgresql";


class User extends Model {
  public id!: number;
  public nombre!: string;
  public primer_apellido!: string;
  public segundo_apellido!: string;
  public nombre_usuario!: string;
  public correo_electronico!: string;
  public contrasena!: string;
  public imagen_firma!: Buffer | null;
  public perfil_asignado!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
try {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      primer_apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      segundo_apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nombre_usuario: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      correo_electronico: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contrasena: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      imagen_firma: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      perfil_asignado: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,

      tableName: "Usuarios",
      schema: "panasonic",
    }
  );
} catch (error: any) {
  console.log("error en model user: " + error.message);
}
sequelize
  .sync()
  .then(() => console.log("Database & tables created!"))
  .catch((error) => console.error("Unable to connect to the database:", error));

export default User;
