import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento con un condicional para la carpeta de destino
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    if (file.fieldname === 'Fotografia') {
      uploadPath = 'uploads/Fotografias';
    } else if (file.fieldname === 'OrdenCompraImagen') {
      uploadPath = 'uploads/Ordenes';
    } else if (file.fieldname === 'FacturaImagen') {
      uploadPath = 'uploads/Facturas';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });
