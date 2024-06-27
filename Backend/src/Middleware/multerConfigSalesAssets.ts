import multer from 'multer';
import path from 'path';

const storageSalesAssets = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = '';
      if (file.fieldname === 'DocumentoAprobado') {
        uploadPath = 'uploads/DocumentoAprobadoVentas';
      } else if (file.fieldname === 'CotizacionVentas') {
        uploadPath = 'uploads/CotizacionesVentas';
      } else if (file.fieldname === 'Fotografia') {
        uploadPath = 'uploads/FotogreafiasVentas';
      } else if (file.fieldname === 'Comprobante') {
        uploadPath = 'uploads/ComprobanteVentas';
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploadSalesAssets = multer({ storage: storageSalesAssets });