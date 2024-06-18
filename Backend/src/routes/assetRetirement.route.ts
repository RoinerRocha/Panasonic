import { Router } from "express";
import {
  saveAssetRetirement,
   getAssetRetirements,
   deleteAssetRetirement,
   updateAssetRetirement,
} from "../controller/assetRetirementController";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
  res.send("Hello, asset retirements");
});

router.post("/saveAssetRetirement", saveAssetRetirement);
 router.get("/getAssetRetirements", getAssetRetirements);

router.put("/assetRetirements/:id", updateAssetRetirement);

 router.delete("/deleteAssetRetirement/:id", deleteAssetRetirement);

export default router;
