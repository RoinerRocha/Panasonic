import express from "express";
import morgan  from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./Services/Postgresql";
//import {connection} from "./Services/Postgresql";
import routerLogin from './routes/login.router';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

//const PORT = 3000;
const PORT = process.env.PORT || 5000;

//connection();
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
     sequelize.authenticate();
    console.log("Connection DataBase has been established successfully. ;)");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

/*app.listen(PORT, ()=> {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});*/

app.use('/api', routerLogin);

// import cors from "cors";
// import bodyParser from "body-parser";
// import { Pool } from "pg";
// import "dotenv/config";
// import { Client } from 'pg';


// //import pool from './models/model.login';
// import router from './routes/route.login';

// const app = express();
// app.use(cors());
// //app.use(bodyParser.json());
// app.use(express.json());
// app.use('/api', router);

// const PORT = process.env.PORT || 5000;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// app.get("/", (req, res) => {
//   res.send("Hola, servidor en funcionamiento!");
// });

// app.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${PORT}`);
// });

// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//   });
  
//   client.connect()
//     .then(() => console.log('Connected to the database...'))
//     .catch((err: { stack: any; }) => console.error('Connection error, más detalles: ', err.stack)); 
