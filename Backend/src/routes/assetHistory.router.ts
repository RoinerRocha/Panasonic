import { Router } from "express";
import {
    getHistory,
    searchHistoryByUserName
} from "../controller/assetHistoryController"

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
    res.send("Hello, Historial");
  });
  
  router.get("/getHistorial", getHistory);

  router.get("/searchHistoryByUserName/:user", searchHistoryByUserName);

  export default router;