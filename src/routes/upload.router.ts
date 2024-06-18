import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Aquí se especifica la carpeta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), uploadImage);

export default router;
