import { Router } from "express";
import {
  saveZona,
  getZona,
  deleteZona,
  updateZona,
} from "../controller/zonaController";
const router = Router();
// Más rutas aquí..

router.get("/", (req, res) => {
  res.send("Hello, zona");
});

router.post("/saveZona", saveZona);
router.get("/getZona", getZona);

router.put("/updateZona/:id", updateZona);

router.delete("/deleteZona/:id", deleteZona);
export default router;
