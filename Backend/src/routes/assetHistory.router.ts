import { Router } from "express";
import {
    getHistorial
} from "../controller/assetHistoryController"

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
    res.send("Hello, Historial");
  });
  
  router.get("/getHistorial", getHistorial);

  export default router;