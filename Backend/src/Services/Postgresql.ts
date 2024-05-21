import { Sequelize } from "sequelize";

export const connection= async() => {
    const sequelize = new Sequelize('sistemaDeActivosFijos', 'postgres', 'admin', {
        host: 'localhost',
        dialect: 'postgres',
      });


      try {
        await sequelize.authenticate();
        console.log('Connection Data Base has been established successfully. ;)');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}