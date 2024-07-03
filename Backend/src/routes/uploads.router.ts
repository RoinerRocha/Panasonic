import path from "path";
import express, { Router } from "express";
const router = Router();
/**estas rutas hay que corregirlas para quitarlas del index.ts,
 * por le momento no se esta utilizando.
 */

// Servir archivos estáticos desde la carpeta 'uploads'
router.get('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configura las rutas para servir imágenes desde subcarpetas específicas
router.get('/uploads/ComprobanteVentas', express.static(path.join(__dirname, '../uploads/ComprobanteVentas')));
router.get('/uploads/CotizacionesVentas', express.static(path.join(__dirname, '../uploads/CotizacionesVentas')));
router.get('/uploads/DocumentoAprobadoBajas', express.static(path.join(__dirname, '../uploads/DocumentoAprobadoBajas')));
router.get('/uploads/DocumentoAprobadoVentas', express.static(path.join(__dirname, '../uploads/DocumentoAprobadoVentas')));
router.get('/uploads/Facturas', express.static(path.join(__dirname, '../uploads/Facturas')));
router.get('/uploads/Fotografias', express.static(path.join(__dirname, '../uploads/Fotografias')));
router.get('/uploads/FotografiasBajas', express.static(path.join(__dirname, '../uploads/FotografiasBajas')));
router.get('/uploads/FotogreafiasVentas', express.static(path.join(__dirname, '../uploads/FotogreafiasVentas')));
router.get('/uploads/Ordenes', express.static(path.join(__dirname, '../uploads/Ordenes')));

export default router;