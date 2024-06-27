import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento con un condicional para la carpeta de destino
const storageAssetRetirement = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = '';
      if (file.fieldname === 'DocumentoAprobado') {
        uploadPath = 'uploads/DocumentoAprobadoBajas';
      } else if (file.fieldname === 'Fotografia') {
        uploadPath = 'uploads/FotografiasBajas';
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploadAssetRetirement = multer({ storage: storageAssetRetirement });