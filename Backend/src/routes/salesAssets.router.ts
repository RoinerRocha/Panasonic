import { Router } from "express";
import {
  saveSalesAsset,
   getSalesAssets,
    getAssetSaleByNumeroBoleta
//   deleteSalesAsset,
//   updateSalesAsset,
} from "../controller/salesAssetsController";
import { uploadSalesAssets } from "../Middleware/multerConfigSalesAssets";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, sales assets");
});

router.post(
  "/saveSalesAsset",
  uploadSalesAssets.fields([
    {name: 'DocumentoAprobado', maxCount: 1},
    {name: 'CotizacionVentas', maxCount: 1},
    {name: 'Fotografia', maxCount: 1},
    {name: 'Comprobante', maxCount: 1},
  ]),
  saveSalesAsset
)

router.post("/saveSalesAsset", saveSalesAsset);
router.get("/getSalesAssets", getSalesAssets);
router.get("/salesAssets/boleta/:NumeroBoleta", getAssetSaleByNumeroBoleta);

// router.put("/salesAssets/:id", updateSalesAsset);

// router.delete("/deleteSalesAsset/:id", deleteSalesAsset);

export default router;
