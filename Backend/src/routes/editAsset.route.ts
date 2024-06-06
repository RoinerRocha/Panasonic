import { Router } from "express";
import {
  saveEditAsset,
//   getEditAssets,
//   deleteEditAsset,
//   updateEditAsset,
} from "../controller/editAssetController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, edited assets");
});

router.post("/saveEditAsset", saveEditAsset);
// router.get("/getEditAssets", getEditAssets);

// router.put("/editAssets/:id", updateEditAsset);

// router.delete("/deleteEditAsset/:id", deleteEditAsset);

export default router;
