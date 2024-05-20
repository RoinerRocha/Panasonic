import express from "express";
import { connection } from "./Services/Postgresql";

const app = express();

const PORT = 3000;

connection();

app.listen(PORT, ()=> {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


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
