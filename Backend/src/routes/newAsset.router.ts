import { Router } from "express";
import {
  saveNewAsset,
  getNewAssets,
  deleteNewAsset,
  updateNewAsset,
  searchIdNewAsset,
  getAssetRetirementByNumeroBoleta,
} from "../controller/newAssetController";
import { upload } from '../Middleware/multerConfig';

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, new assets");
});

router.post(
  "/saveNewAsset",
  upload.fields([
    { name: 'Fotografia', maxCount: 1 },
    { name: 'OrdenCompraImagen', maxCount: 1 },
    { name: 'FacturaImagen', maxCount: 1 }
  ]),
  saveNewAsset
);

router.get("/getNewAssets", getNewAssets);

router.put("/newAssets/:id", updateNewAsset);

router.delete("/deleteNewAsset/:id", deleteNewAsset);
router.get("/searchIdNewAsset/:id", searchIdNewAsset);

router.get("/assetByNumBolet/boleta/:NumeroBoleta", getAssetRetirementByNumeroBoleta);

export default router;
