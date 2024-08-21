import { Router } from "express";
import {
  saveZona,
  getZona,
  deleteZona,
  updateZona,
} from "../controller/zonaController";
import { uploadMaps } from "../Middleware/multerMaps";
const router = Router();
// Más rutas aquí..

router.get("/", (req, res) => {
  res.send("Hello, zona");
});

router.post(
  "/saveZona", 
  uploadMaps.fields([
    { name: 'ImagenMapa', maxCount: 1}
  ]), saveZona
);
router.get("/getZona", getZona);

router.put(
  "/zonas/:id", 
  uploadMaps.fields([
    { name: 'ImagenMapa', maxCount: 1}
]), updateZona);

router.delete("/deleteZona/:id", deleteZona);
export default router;
