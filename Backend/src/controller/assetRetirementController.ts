import { Request, Response } from "express";
import AssetRetirementModel from "../models/assetRetirementModel";
import { Op } from "sequelize";
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import ExcelJS from "exceljs";
import { writeFileSync, unlink } from "fs";


interface MulterFiles {
  DocumentoAprobado?: Express.Multer.File[];
  Fotografia?: Express.Multer.File[];
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
// Método para guardar la baja de un activo
export const saveAssetRetirement = async (req: Request, res: Response) => {
  const {
    PlacaActivo,
    Descripcion,
    DestinoFinal,
    NumeroBoleta,
    Usuario,
  } = req.body;

  const files = req.files as MulterFiles;

  const documentoAprobadoPath = files?.DocumentoAprobado?.[0]?.path || null;
  const fotografiaPath = files?.Fotografia?.[0]?.path || null;

  try {
    const assetRetirement = await AssetRetirementModel.create({
      PlacaActivo,
      DocumentoAprobado: documentoAprobadoPath,
      Descripcion,
      DestinoFinal,
      Fotografia: fotografiaPath,
      NumeroBoleta,
      Usuario,
    });

    res
      .status(201)
      .json({
        message: "Asset retirement created successfully",
        data: assetRetirement,
      });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message, stack: error.stack } });
  }
};

// Método para obtener todas las bajas de activos
export const getAssetRetirements = async (req: Request, res: Response) => {
  try {
    const assetRetirements = await AssetRetirementModel.findAll();
    res
      .status(200)
      .json({
        message: "List of asset retirements successful",
        data: assetRetirements,
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar una baja de activo por ID
export const deleteAssetRetirement = async (req: Request, res: Response) => {
  const assetRetirementId = req.params.id;

  try {
    const assetToDelete = await AssetRetirementModel.findByPk(assetRetirementId);

    if (!assetToDelete) {
      return res.status(404).json({ message: "Asset retirement not found" });
    }

    // Eliminar archivos asociados
    if (assetToDelete.Fotografia) {
      deleteFile(path.resolve(assetToDelete.Fotografia));
    }
    if (assetToDelete.DocumentoAprobado) {
      deleteFile(path.resolve(assetToDelete.DocumentoAprobado));
    }

    // Eliminar el retiro de activo de la base de datos
    await AssetRetirementModel.destroy({
      where: { id: assetRetirementId },
    });

    res.status(200).json({ message: "Delete asset retirement successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar una baja de activo
export const updateAssetRetirement = async (req: Request, res: Response) => {
  const assetRetirementId = req.params.id;
  const {
    PlacaActivo,
    Descripcion,
    DestinoFinal,
    NumeroBoleta,
    Usuario,
  } = req.body;

  const files = req.files as MulterFiles;

  const fotografiaPath = files?.Fotografia?.[0]?.path || null;
  const documentoAprobadoPath = files?.DocumentoAprobado?.[0]?.path || null;

  try {
    const existingAssetRetirement = await AssetRetirementModel.findByPk(assetRetirementId);

    if (!existingAssetRetirement) {
      return res.status(404).json({ message: "Asset retirement not found" });
    }

    const updateData: any = {
      PlacaActivo,
      Descripcion,
      DestinoFinal,
      NumeroBoleta,
      Usuario,
    };

    // Solo actualizar las rutas de los archivos si se han subido nuevos archivos
    if (fotografiaPath) {
      updateData.Fotografia = fotografiaPath;
    }
    if (documentoAprobadoPath) {
      updateData.DocumentoAprobado = documentoAprobadoPath;
    }

    const [updated] = await AssetRetirementModel.update(updateData, {
      where: { id: assetRetirementId },
      returning: true,
    });

    if (updated) {
      // Eliminar los archivos antiguos solo si se han subido nuevos archivos
      if (fotografiaPath && existingAssetRetirement.Fotografia) {
        deleteFile(path.resolve(existingAssetRetirement.Fotografia));
      }
      if (documentoAprobadoPath && existingAssetRetirement.DocumentoAprobado) {
        deleteFile(path.resolve(existingAssetRetirement.DocumentoAprobado));
      }

      const updatedAssetRetirement = await AssetRetirementModel.findByPk(assetRetirementId);
      res
        .status(200)
        .json({
          message: "Update asset retirement successful",
          data: updatedAssetRetirement,
        });
    } else {
      res.status(404).json({ message: "Asset retirement not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para obtener bajas de activos por el número de boleta que empiecen con una letra específica
const numeroBoletaSchema = Joi.string().required().pattern(/^[A-Za-z]/);

export const getAssetRetirementByNumeroBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params;

  try {
    await numeroBoletaSchema.validateAsync(NumeroBoleta);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid NumeroBoleta' });
  }

  try {
    const assetRetirement = await AssetRetirementModel.findAll({
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

//Metodo para buscar una baja de  activo mediante barra de busqueda
export const searchSalesRetirenement = async (req: Request, res: Response) => {
  const { searchRetirement } = req.query;

  try {
    const assetRetirement = await AssetRetirementModel.findAll({
      where: {
        [Op.or]: [
          { PlacaActivo: { [Op.like]: `%${searchRetirement}%` } },
          { NumeroBoleta: { [Op.like]: `%${searchRetirement}%` } },
          { Usuario: { [Op.like]: `%${searchRetirement}%` } },
        ],
      },
    });

    res.status(200).json({ message: "Search results fetched successfully", data: assetRetirement });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssetRetirementPlate = async (req: Request, res: Response) => {
  const { PlacaActivo } = req.params;

  try {
    const assetRetirement = await AssetRetirementModel.findOne({
      where: {
        PlacaActivo: {
          [Op.eq]: PlacaActivo,
        },
      },
    });

    if (assetRetirement) {
      res.status(200).json({
        message: "Asset retirement fetched successfully",
        data: assetRetirement,
      });
    } else {
      res.status(404).json({ message: "Asset retirement not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateExcelFile = async (req: Request, res: Response) => {
  const assetRetirementId   = req.params.id;

  try {
    const asset = await AssetRetirementModel.findByPk(assetRetirementId );

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asset Information");

    worksheet.columns = [
      { header: "Placa de activo", key: "plate", width: 30 },
      { header: "Descripcion", key: "description", width: 30 },
      { header: "Destino Final", key: "Destiny", width: 30 },
      { header: "Documento de Aprobacion", key: "Document", width: 30 },
      { header: "Fotografia", key: "photo", width: 30 },
      { header: "Numero Boleta", key: "ballot", width: 30 },
      { header: "Usuario", key: "user", width: 30 },
    ];

    const assetData = {
      plate: asset.PlacaActivo,
      description: asset.Descripcion,
      Destiny: asset.DestinoFinal,
      Document: asset.DocumentoAprobado ? "Approval document available / Documento de aprobación disponible" : "No approval document / Sin documento de aprobación",
      photo: asset.Fotografia ? "Photo available / Fotografía disponible" : "No photo / Sin fotografía",
      ballot: asset.NumeroBoleta,
      user: asset.Usuario,
    };

    const row = worksheet.addRow(assetData);
    row.alignment = { vertical: 'middle', horizontal: 'center' };

    const filePath = `./uploads/Asset_${asset.NumeroBoleta}.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, `Asset_${asset.NumeroBoleta}.xlsx`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
      unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};