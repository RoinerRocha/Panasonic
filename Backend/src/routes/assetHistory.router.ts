import { Router } from "express";
import {
    getHistory,
    searchHistoryByUserName,
    getHistoryForTipeUser,
    uploadDocumentByBoleta,
    searchHistoryByNumeroBoleta,
} from "../controller/assetHistoryController"

import { uploadAssetRetirement } from "../Middleware/multerConfigAssetRetirement";

const router = Router();

// Rutas adicionales aquí...
router.get("/", (req, res) => {
    res.send("Hello, Historial");
  });
  
  router.get("/getHistorial", getHistory);

  router.get("/searchHistoryByUserName/:usuario", searchHistoryByUserName);
  router.get("/getHistoryForTipeUser/", getHistoryForTipeUser);
  router.get("/searchHistoryByNumeroBoleta/:NumeroBoleta", searchHistoryByNumeroBoleta);

  router.post(
    "/uploadDocumentByBoleta/:NumeroBoleta",
    uploadAssetRetirement.single("DocumentoAprobado"), 
    uploadDocumentByBoleta
  );

  export default router;