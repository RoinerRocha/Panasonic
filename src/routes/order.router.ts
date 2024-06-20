import { Router } from 'express';
import { orderImage } from '../controllers/ordersController';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'ordenCompra'); // Aquí se especifica la carpeta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const order = multer({ storage });

router.post('/', order.single('image'), orderImage);

export default router;