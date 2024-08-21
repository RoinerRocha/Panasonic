import multer from 'multer';
import path from 'path';

const storageMap =  multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.fieldname === 'ImagenMapa'){
            uploadPath = 'uploads/Mapas';
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploadMaps = multer({ storage: storageMap })