import { Router } from "express";
import {
  saveSalesAsset,
   getSalesAssets,
    getAssetSaleByNumeroBoleta,
    searchSalesAssets,
    updateSalesAsset,
    deleteSalesAsset,
    generateExcelFile,
 //   totalVentas
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

router.put(
  "/salesAssets/:id",
  uploadSalesAssets.fields([
    { name: 'CotizacionVentas', maxCount: 1 },
    { name: 'DocumentoAprobado', maxCount: 1 },
    { name: 'Fotografia', maxCount: 1 },
    { name: 'Comprobante', maxCount: 1 }
  ]),
  updateSalesAsset
);

router.get("/getSalesAssets", getSalesAssets);
router.get("/salesAssets/boleta/:NumeroBoleta", getAssetSaleByNumeroBoleta);
router.get("/searchSalesAssets", searchSalesAssets);
router.get("/SalesExcelFile/:id", generateExcelFile);
//router.get("/totalSalesAssets", totalVentas);

// router.put("/salesAssets/:id", updateSalesAsset);

router.delete("/deleteSalesAsset/:id", deleteSalesAsset);

export default router;
