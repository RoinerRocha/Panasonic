import { Router } from "express";
import {
  saveAssetRetirement,
   getAssetRetirements,
   deleteAssetRetirement,
   updateAssetRetirement,
   getAssetRetirementByNumeroBoleta, 
   searchSalesRetirenement,
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

router.put("/assetRetirements/:id", updateAssetRetirement);

router.delete("/deleteAssetRetirement/:id", deleteAssetRetirement);

router.get("/assetRetirements/boleta/:NumeroBoleta", getAssetRetirementByNumeroBoleta);

router.get("/searchAssetsRetirenement", searchSalesRetirenement);

export default router;
