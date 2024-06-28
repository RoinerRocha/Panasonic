import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./Services/Postgresql";
//import {connection} from "./Services/Postgresql";

//routes
import routerLogin from "./routes/login.router";
import routerBuggy from "./routes/buggy.router";
import { exceptionMiddleware } from "./Middleware/exceptionMiddleware";
import routerZona from "./routes/zona.router";
import routerAccountingAccounts from "./routes/accountingAccounts.router"
import routerStatus from "./routes/statusAssets.router"
import routerProfile from "./routes/profile.router"
import routerServiceLife from "./routes/serviceLife.router"
import routerNewAsset from "./routes/newAsset.router"
import routerEditAsset from "./routes/editAsset.route"
import routerAssetRetirement from "./routes/assetRetirement.route"
import routerSalesAssets from "./routes/salesAssets.router"
import routerDepreciation from "./routes/depreciation.router"

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(exceptionMiddleware);

//const PORT = 3000;
const PORT = process.env.PORT || 5000;

//connection();
sequelize
  .sync({ force: false })
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

app.use("/api", routerLogin);
app.use("/api/buggy", routerBuggy);
app.use("/api", routerZona);
app.use("/api", routerAccountingAccounts);
app.use("/api", routerStatus);
app.use("/api", routerProfile);
app.use("/api", routerServiceLife);
app.use("/api", routerNewAsset);
app.use("/api", routerEditAsset);
app.use("/api", routerAssetRetirement);
app.use("/api", routerSalesAssets);
app.use("/api", routerDepreciation);


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
