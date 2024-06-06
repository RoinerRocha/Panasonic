import { Router } from "express";
import {
  saveSalesAsset,
//   getSalesAssets,
//   deleteSalesAsset,
//   updateSalesAsset,
} from "../controller/salesAssetsController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, sales assets");
});

router.post("/saveSalesAsset", saveSalesAsset);
// router.get("/getSalesAssets", getSalesAssets);

// router.put("/salesAssets/:id", updateSalesAsset);

// router.delete("/deleteSalesAsset/:id", deleteSalesAsset);

export default router;
