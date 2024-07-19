  import { Request, Response } from "express";
  import NewAssetModel from "../models/newAssetModel";
  import axios from 'axios';
  import FormData from 'form-data';
  import fs from 'fs';
  import multer from 'multer';
  import { Op } from "sequelize";
  import { upload } from '../Middleware/multerConfig'
  import Joi from 'joi';
  import path from 'path';


  interface MulterFiles {
    Fotografia?: Express.Multer.File[];
    OrdenCompraImagen?: Express.Multer.File[];
    FacturaImagen?: Express.Multer.File[];
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
  
  // Método para guardar un nuevo activo
  export const saveNewAsset = async (req: Request, res: Response) => {
    const {
      CodigoCuenta,
      Zona,
      Tipo,
      Estado,
      Descripcion,
      NumeroPlaca,
      ValorCompraCRC,
      ValorCompraUSD,
      NombreProveedor,
      FechaCompra,
      FacturaNum,
      OrdenCompraNum,
      NumeroAsiento,
      NumeroBoleta,
      Usuario
    } = req.body;

    const files = req.files as MulterFiles;

    const fotografiaPath = files?.Fotografia?.[0]?.path || null;
    const ordenCompraImagenPath = files?.OrdenCompraImagen?.[0]?.path || null;
    const facturaImagenPath = files?.FacturaImagen?.[0]?.path || null;

    try {
      const existingPlacaNum = await NewAssetModel.findOne({ where: { NumeroPlaca } });
      if (existingPlacaNum ) {
        return res.status(400).json({ message: "El numero de placa ya existe" });
      }

      const existingFacturaNum = await NewAssetModel.findOne({ where: { FacturaNum } });
      if (existingFacturaNum) {
        return res.status(400).json({ message: "El numero de factura debe de ser diferente" });
      }

      const newAsset = await NewAssetModel.create({
        CodigoCuenta,
        Zona,
        Tipo,
        Estado,
        Descripcion,
        NumeroPlaca,
        ValorCompraCRC,
        ValorCompraUSD,
        Fotografia: fotografiaPath,
        NombreProveedor,
        FechaCompra,
        FacturaNum,
        FacturaImagen: facturaImagenPath,
        OrdenCompraNum,
        OrdenCompraImagen: ordenCompraImagenPath,
        NumeroAsiento,
        NumeroBoleta,
        Usuario
      });

      res.status(201).json({ message: "New asset created successfully", data: newAsset });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  // Método para obtener todos los nuevos activos
  export const getNewAssets = async (req: Request, res: Response) => {
    try {
      const newAssets = await NewAssetModel.findAll();
      res.status(200).json({ message: "List of new assets successful", data: newAssets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Método para eliminar un nuevo activo por ID por si acaso
  export const deleteNewAsset = async (req: Request, res: Response) => {
    const newAssetId = req.params.id;
  
    try {
      const assetToDelete = await NewAssetModel.findByPk(newAssetId);
  
      if (!assetToDelete) {
        return res.status(404).json({ message: "New asset not found" });
      }
  
      // Eliminar archivos de imagen asociados
      if (assetToDelete.Fotografia) {
        deleteFile(path.resolve(assetToDelete.Fotografia));
      }
      if (assetToDelete.OrdenCompraImagen) {
        deleteFile(path.resolve(assetToDelete.OrdenCompraImagen));
      }
      if (assetToDelete.FacturaImagen) {
        deleteFile(path.resolve(assetToDelete.FacturaImagen));
      }
  
      // Eliminar el activo de la base de datos
      await NewAssetModel.destroy({
        where: { id: newAssetId },
      });
  
      res.status(200).json({ message: "Delete new asset successful" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Método para buscar un nuevo activo por ID por si acaso
  export const searchIdNewAsset = async (req: Request, res: Response) => {
    const newAssetId = req.params.id;
  
    try {
      const newAsset = await NewAssetModel.findByPk(newAssetId);

      if (!newAsset) {
        return res.status(404).json({ message: "Search New asset not found..." });
      }

      res.status(200).json({ message: "Search ID new asset successful", data: newAsset });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };


  // Método para actualizar un nuevo activo
  export const updateNewAsset = async (req: Request, res: Response) => {
    const newAssetId = req.params.id;
    const {
      CodigoCuenta,
      Zona,
      Tipo,
      Estado,
      Descripcion,
      NumeroPlaca,
      ValorCompraCRC,
      ValorCompraUSD,
      NombreProveedor,
      FechaCompra,
      FacturaNum,
      OrdenCompraNum,
      NumeroAsiento,
      NumeroBoleta,
      Usuario
    } = req.body;
  
    const files = req.files as MulterFiles;
  
    const fotografiaPath = files?.Fotografia?.[0]?.path || null;
    const ordenCompraImagenPath = files?.OrdenCompraImagen?.[0]?.path || null;
    const facturaImagenPath = files?.FacturaImagen?.[0]?.path || null;
  
    try {
      const existingAsset = await NewAssetModel.findByPk(newAssetId);
  
      if (!existingAsset) {
        return res.status(404).json({ message: "New asset not found" });
      }
  
      const updateData: any = {
        CodigoCuenta,
        Zona,
        Tipo,
        Estado,
        Descripcion,
        NumeroPlaca,
        ValorCompraCRC,
        ValorCompraUSD,
        NombreProveedor,
        FechaCompra,
        FacturaNum,
        OrdenCompraNum,
        NumeroAsiento,
        NumeroBoleta,
        Usuario,
      };
  
      // Solo actualizar las rutas de las imágenes si se han subido nuevas imágenes
      if (fotografiaPath) {
        updateData.Fotografia = fotografiaPath;
      }
      if (ordenCompraImagenPath) {
        updateData.OrdenCompraImagen = ordenCompraImagenPath;
      }
      if (facturaImagenPath) {
        updateData.FacturaImagen = facturaImagenPath;
      }
  
      const [updated] = await NewAssetModel.update(updateData, {
        where: { id: newAssetId },
        returning: true,
      });
  
      if (updated) {
        // Eliminar las imágenes antiguas solo si se han subido nuevas imágenes
        if (fotografiaPath && existingAsset.Fotografia) {
          deleteFile(path.resolve(existingAsset.Fotografia));
        }
        if (ordenCompraImagenPath && existingAsset.OrdenCompraImagen) {
          deleteFile(path.resolve(existingAsset.OrdenCompraImagen));
        }
        if (facturaImagenPath && existingAsset.FacturaImagen) {
          deleteFile(path.resolve(existingAsset.FacturaImagen));
        }
  
        const updatedNewAsset = await NewAssetModel.findByPk(newAssetId);
        res
          .status(200)
          .json({ message: "Update new asset successful", data: updatedNewAsset });
      } else {
        res.status(404).json({ message: "New asset not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };


  const numeroBoletaSchema = Joi.string().required().pattern(/^[A-Za-z]/);

export const getAssetRetirementByNumeroBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params;

  try {
    await numeroBoletaSchema.validateAsync(NumeroBoleta);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid NumeroBoleta' });
  }

  try {
    const assetRetirement = await NewAssetModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.like]: `${NumeroBoleta}%`,
        },
      },
    });

    if (assetRetirement.length >= 0) {
      res.status(200).json({
        message: "Asset retirements fetched successfully",
        data: assetRetirement,
      });
    } 
    else {
      res.status(404).json({ message: "Asset retirements not found" });
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
export const searchNewAssets = async (req: Request, res: Response) => {
  const { searchAsset } = req.query;

  try {
    const newAsset = await NewAssetModel.findAll({
      where: {
        [Op.or]: [
          { CodigoCuenta: { [Op.like]: `%${searchAsset}%` } },
          { Zona: { [Op.like]: `%${searchAsset}%` } },
          { Tipo: { [Op.like]: `%${searchAsset}%` } },
          { NumeroPlaca: { [Op.like]: `%${searchAsset}%` } },
          { NumeroBoleta: { [Op.like]: `%${searchAsset}%` } },
          { Usuario: { [Op.like]: `%${searchAsset}%` } },
        ],
      },
    });

    res.status(200).json({ message: "Search results fetched successfully", data: newAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};