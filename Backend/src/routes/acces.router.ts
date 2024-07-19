import { Router } from "express";
import {
  getAllAccesses,
  addNewAccess,
  updateAccess,
  deleteAccess,
} from "../controller/accesController";

const router = Router();

// Obtener todos los accesos
router.get("/getAllAccesses", getAllAccesses);

// Agregar un nuevo acceso
router.post("/addNewAccess", addNewAccess);

// Actualizar un acceso existente
router.put("/updateAccess/:id", updateAccess);

// Eliminar un acceso
router.delete("/deleteAccess/:id", deleteAccess);

export default router;
