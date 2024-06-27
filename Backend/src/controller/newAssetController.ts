  import { Request, Response } from "express";
  import NewAssetModel from "../models/newAssetModel";
  import axios from 'axios';
  import FormData from 'form-data';
  import fs from 'fs';
  import multer from 'multer';
  import { Op } from "sequelize";
  import { upload } from '../Middleware/multerConfig'
  import Joi from 'joi';


  interface MulterFiles {
    Fotografia?: Express.Multer.File[];
    OrdenCompraImagen?: Express.Multer.File[];
    FacturaImagen?: Express.Multer.File[];
  }
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
      const deleted = await NewAssetModel.destroy({
        where: { id: newAssetId },
      });

      if (deleted === 0) {
        return res.status(404).json({ message: "New asset not found" });
      }

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
      Fotografia,
      NombreProveedor,
      FechaCompra,
      FacturaNum,
      FacturaImagen,
      OrdenCompraNum,
      OrdenCompraImagen,
      NumeroAsiento,
      NumeroBoleta,
      Usuario
    } = req.body;

    try {
      const [updated] = await NewAssetModel.update(
        {
          CodigoCuenta,
          Zona,
          Tipo,
          Estado,
          Descripcion,
          NumeroPlaca,
          ValorCompraCRC,
          ValorCompraUSD,
          Fotografia,
          NombreProveedor,
          FechaCompra,
          FacturaNum,
          FacturaImagen,
          OrdenCompraNum,
          OrdenCompraImagen,
          NumeroAsiento,
          NumeroBoleta,
          Usuario
        },
        {
          where: { id: newAssetId },
          returning: true,
        }
      );

      if (updated) {
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