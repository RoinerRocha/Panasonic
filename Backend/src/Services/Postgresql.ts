import { Sequelize } from "sequelize";
import dotenv from "dotenv";
//import { Connection } from "pg";

dotenv.config();


  const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
      host: process.env.DB_HOST as string,
      dialect: "postgres",
      logging: console.log,
    }
  
  
  )

 /* try {
    await sequelize.authenticate();
    console.log("Connection DataBase has been established successfully. ;)");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};*/

export default sequelize;