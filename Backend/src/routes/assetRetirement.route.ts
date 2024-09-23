import { Router } from "express";
import {
  saveAssetRetirement,
   getAssetRetirements,
   deleteAssetRetirement,
   updateAssetRetirement,
   getAssetRetirementByNumeroBoleta, 
   getAssetRetirementPlate,
   searchSalesRetirenement,
   generateExcelFile,
} from "../controller/assetRetirementController";
import { uploadAssetRetirement } from "../Middleware/multerConfigAssetRetirement";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, asset retirements");
});

router.post("/saveAssetRetirement",
  uploadAssetRetirement.fields([
    {name: 'DocumentoAprobado', maxCount: 1},
    {name: 'Fotografia', maxCount:1}
  ]),
  saveAssetRetirement
)

router.post("/saveAssetRetirement", saveAssetRetirement);
router.get("/getAssetRetirements", getAssetRetirements);

router.put(
  "/assetRetirements/:id",
  uploadAssetRetirement.fields([
    { name: 'Fotografia', maxCount: 1 },
    { name: 'DocumentoAprobado', maxCount: 1 }
  ]),
  updateAssetRetirement,
);

router.delete("/deleteAssetRetirement/:id", deleteAssetRetirement);

router.get("/assetRetirements/boleta/:NumeroBoleta", getAssetRetirementByNumeroBoleta);

router.get("/assetRetirements/placa/:PlacaActivo", getAssetRetirementPlate);

router.get("/searchAssetsRetirenement", searchSalesRetirenement);

router.get("/RetirementExcelFile/:id", generateExcelFile);

export default router;
