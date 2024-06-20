import { Router } from 'express';
import { invoiceImage } from '../controllers/invoiceController';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'facturas'); // Aquí se especifica la carpeta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const invoice = multer({ storage });

router.post('/', invoice.single('image'), invoiceImage);

export default router;