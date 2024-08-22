import { Router } from "express";
import {
    getHistory,
    searchHistoryByUserName,
    getHistoryForTipeUser
} from "../controller/assetHistoryController"

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
    res.send("Hello, Historial");
  });
  
  router.get("/getHistorial", getHistory);

  router.get("/searchHistoryByUserName/:usuario", searchHistoryByUserName);
  router.get("/getHistoryForTipeUser/", getHistoryForTipeUser);

  export default router;