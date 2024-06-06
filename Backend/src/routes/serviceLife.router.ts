import { Router } from "express";
import {
  saveServiceLife,
  getServiceLifes,
  deleteServiceLife,
  updateServiceLife,
} from "../controller/serviceLifeController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, service life");
});

router.post("/saveServiceLife", saveServiceLife);
router.get("/getServiceLifes", getServiceLifes);

router.put("/serviceLifes/:id", updateServiceLife);

router.delete("/deleteServiceLife/:id", deleteServiceLife);

export default router;