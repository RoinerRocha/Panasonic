import { Router } from "express";
import {
  saveStatusAsset,
  getStatusAssets,
  deleteStatusAsset,
  updateStatusAsset,
} from "../controller/StatusAssetsController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, status assets");
});

router.post("/saveStatusAsset", saveStatusAsset);
router.get("/getStatusAssets", getStatusAssets);

router.put("/statusAssets/:id", updateStatusAsset);

router.delete("/deleteStatusAsset/:id", deleteStatusAsset);

export default router;
