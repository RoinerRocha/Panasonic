import { Router } from "express";
import {
  saveNewAsset,
  getNewAssets,
  deleteNewAsset,
  updateNewAsset,
  searchIdNewAsset,
  getAssetRetirementByNumeroBoleta,
  searchNewAssets,
  generateWordFile,
  generatePDFFile,
  generateExcelFile,
  generateMultipleExcelFiles,
  searchAssetsByZona,
  saveAssetPositions,
  getAssetPositions,
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

router.get("/searchAssetsByZona", searchAssetsByZona);


router.put(
  "/newAssets/:id",
  upload.fields([
    { name: 'Fotografia', maxCount: 1 },
    { name: 'OrdenCompraImagen', maxCount: 1 },
    { name: 'FacturaImagen', maxCount: 1 }
  ]),
  updateNewAsset
);

router.delete("/deleteNewAsset/:id", deleteNewAsset);
router.get("/searchIdNewAsset/:id", searchIdNewAsset);

router.get("/assetByNumBolet/boleta/:NumeroBoleta", getAssetRetirementByNumeroBoleta);

router.get("/searchNewAssets",  searchNewAssets);
router.get("/generateWord/:id", generateWordFile);
router.get("/generatePDF/:id", generatePDFFile);
router.get("/generateExcelFile/:id", generateExcelFile);
router.post("/generateMultipleExcel", generateMultipleExcelFiles);

router.post("/saveAssetPositions",saveAssetPositions);//guardar coordenadas de la img del activo en el mapa
// Ruta para obtener las posiciones de los activos por zona
router.get("/getAssetPositions/:Zona",getAssetPositions);//mostrar coordenadas de la img del activo en el mapa

export default router;
