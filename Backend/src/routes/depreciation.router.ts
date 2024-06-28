import { Router } from "express";
import {
  saveDepreciation,
  getDepreciations,
  deleteDepreciation,
  updateDepreciation,
} from "../controller/depreciationController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, depreciation");
});

router.post("/saveDepreciation", saveDepreciation);
router.get("/getDepreciations", getDepreciations);
router.put("/depreciations/:id", updateDepreciation);
router.delete("/deleteDepreciation/:id", deleteDepreciation);

export default router;
