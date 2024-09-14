import { Request, Response } from "express";
import SalesAssetsModel from "../models/salesAssetsModel";
import { Op } from "sequelize";
import Joi from 'joi';
import fs from 'fs';
import path from 'path';


interface MulterFiles {
  DocumentoAprobado?: Express.Multer.File[];
  CotizacionVentas?: Express.Multer.File[];
  Fotografia?: Express.Multer.File[];
  Comprobante?: Express.Multer.File[];
}

const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

/*export const totalVentas = async (req: Request, res: Response) => { //revisar y terminarlo
  try {
    const salesAssets = await SalesAssetsModel.findAll();

    // Calcula el total de activos vendidos
    const totalAmountSold = salesAssets.reduce((total, asset) => total + asset.amount, 0);

    res.status(200).json({
      message: "List of sales assets successful",
      data: salesAssets,
      kpi: {
        totalAmountSold,
        totalAssetsSold: salesAssets.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
*/

// Método para guardar la venta de un activo
export const saveSalesAsset = async (req: Request, res: Response) => {
  const { 
    PlacaActivo,  
    Descripcion, 
    MontoVentas,    
    NumeroBoleta, 
    Usuario
  } = req.body;

  const files = req.files as MulterFiles;

  const documentoAprobadoPath = files?.DocumentoAprobado?.[0]?.path || null;
  const cotizacionVentasPath = files?.CotizacionVentas?.[0]?.path || null;
  const fotografiaPath = files?.Fotografia?.[0]?.path || null;
  const comprobantePath = files?.Comprobante?.[0]?.path || null;

  try {
    const salesAsset = await SalesAssetsModel.create({
      PlacaActivo,
      DocumentoAprobado: documentoAprobadoPath,
      Descripcion,
      MontoVentas,
      CotizacionVentas: cotizacionVentasPath,
      Fotografia: fotografiaPath,
      Comprobante: comprobantePath,
      NumeroBoleta,
      Usuario
    });

    res.status(201).json({ message: "Sales asset created successfully", data: salesAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todas las ventas de activos
 export const getSalesAssets = async (req: Request, res: Response) => {
   try {
     const salesAssets = await SalesAssetsModel.findAll();
      res.status(200).json({ message: "List of sales assets successful", data: salesAssets });
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
 };

 const numeroBoletaSchema = Joi.string().required().pattern(/^[A-Za-z]/);

export const getAssetSaleByNumeroBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params;

  try {
    await numeroBoletaSchema.validateAsync(NumeroBoleta);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid NumeroBoleta' });
  }

  try {
    const salesAsset = await SalesAssetsModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.like]: `${NumeroBoleta}%`,
        },
      },
    });

    if (salesAsset.length >= 0) {
      res.status(200).json({
        message: "Sale Asset fetched successfully",
        data: salesAsset,
      });
    } 
    else {
      res.status(404).json({ message: "Sale Asset not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

//Metodo para buscar una venta de activo mediante barra de busqueda
export const searchSalesAssets = async (req: Request, res: Response) => {
  const { searchQuery } = req.query;

  try {
    const salesAssets = await SalesAssetsModel.findAll({
      where: {
        [Op.or]: [
          { PlacaActivo: { [Op.like]: `%${searchQuery}%` } },
          { NumeroBoleta: { [Op.like]: `%${searchQuery}%` } },
          { Usuario: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
    });

    res.status(200).json({ message: "Search results fetched successfully", data: salesAssets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar una venta de activo por ID
export const deleteSalesAsset = async (req: Request, res: Response) => {
  const salesAssetId = req.params.id;

  try {
      // Buscar el activo de ventas por ID
      const assetToDelete = await SalesAssetsModel.findByPk(salesAssetId);

      if (!assetToDelete) {
          return res.status(404).json({ message: "Sales asset not found" });
      }

      // Eliminar archivos de imagen asociados
      if (assetToDelete.Fotografia) {
          deleteFile(path.resolve(assetToDelete.Fotografia));
      }
      if (assetToDelete.Comprobante) {
          deleteFile(path.resolve(assetToDelete.Comprobante));
      }
      if (assetToDelete.CotizacionVentas) {
          deleteFile(path.resolve(assetToDelete.CotizacionVentas));
      }
      if (assetToDelete.DocumentoAprobado) {
        deleteFile(path.resolve(assetToDelete.DocumentoAprobado));
    }

      // Eliminar el activo de ventas de la base de datos
      const deleted = await SalesAssetsModel.destroy({
          where: { id: salesAssetId },
      });

      if (deleted === 0) {
          return res.status(404).json({ message: "Sales asset not found" });
      }

      res.status(200).json({ message: "Delete sales asset successful" });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
};

// Método para actualizar una venta de activo
export const updateSalesAsset = async (req: Request, res: Response) => {
  const salesAssetId = req.params.id;
  const { 
    PlacaActivo,  
    Descripcion, 
    MontoVentas,  
    NumeroBoleta, 
    Usuario 
  } = req.body;

  const files = req.files as MulterFiles;

  // Obtener las rutas de los archivos subidos, si existen
  const CotizacionVentasPath = files?.CotizacionVentas?.[0]?.path || null;
  const DocumentoAprobadoPath = files?.DocumentoAprobado?.[0]?.path || null;
  const fotografiaPath = files?.Fotografia?.[0]?.path || null;
  const comprobantePath = files?.Comprobante?.[0]?.path || null;

  try {
    const existingSalesAsset = await SalesAssetsModel.findByPk(salesAssetId);

    if (!existingSalesAsset) {
      return res.status(404).json({ message: "Sales asset not found" });
    }

    const updateData: any = {
      PlacaActivo,
      Descripcion,
      MontoVentas,
      NumeroBoleta,
      Usuario,
    };

    // Solo actualizar las rutas de las imágenes si se han subido nuevas imágenes
    if (CotizacionVentasPath) {
      updateData.CotizacionVentas = CotizacionVentasPath;
    }
    if (DocumentoAprobadoPath) {
      updateData.CotizacionVentas = DocumentoAprobadoPath;
    }
    if (fotografiaPath) {
      updateData.Fotografia = fotografiaPath;
    }
    if (comprobantePath) {
      updateData.Comprobante = comprobantePath;
    }

    const [updated] = await SalesAssetsModel.update(updateData, {
      where: { id: salesAssetId },
      returning: true,
    });

    if (updated) {
      // Eliminar las imágenes antiguas si se han subido nuevas
      if (CotizacionVentasPath && existingSalesAsset.CotizacionVentas) {
        deleteFile(path.resolve(existingSalesAsset.CotizacionVentas));
      }
      if (DocumentoAprobadoPath && existingSalesAsset.DocumentoAprobado) {
        deleteFile(path.resolve(existingSalesAsset.DocumentoAprobado));
      }
      if (fotografiaPath && existingSalesAsset.Fotografia) {
        deleteFile(path.resolve(existingSalesAsset.Fotografia));
      }
      if (comprobantePath && existingSalesAsset.Comprobante) {
        deleteFile(path.resolve(existingSalesAsset.Comprobante));
      }

      const updatedSalesAsset = await SalesAssetsModel.findByPk(salesAssetId);
      res
        .status(200)
        .json({ message: "Update sales asset successful", data: updatedSalesAsset });
    } else {
      res.status(404).json({ message: "Sales asset not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Método para obtener bajas de activos por el número de boleta que empiecen con una letra específica
export const getAssetRetirementByNumeroBoleta = async (req: Request, res: Response) => {
  const {letraNumBoleta} =  req.params;
  try {
    const assetSale = await SalesAssetsModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.like]: `${letraNumBoleta}%`,
        },
      },
    });

    if (assetSale.length >= 0) {
      res.status(200).json({
        message: "Asset Sales fetched successfully",
        data: assetSale,
      });
    } else {
      res.status(404).json({ message: "Asset Sales not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};