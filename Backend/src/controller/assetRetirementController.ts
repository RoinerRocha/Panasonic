import { Request, Response } from "express";
import AssetRetirementModel from "../models/assetRetirementModel";

// Método para guardar la baja de un activo
export const saveAssetRetirement = async (req: Request, res: Response) => {
  const {
    PlacaActivo,
    DocumentoAprobado,
    Descripcion,
    DestinoFinal,
    Fotografia,
    NumeroBoleta,
    Usuario,
  } = req.body;

  try {
    const assetRetirement = await AssetRetirementModel.create({
      PlacaActivo,
      DocumentoAprobado,
      Descripcion,
      DestinoFinal,
      Fotografia,
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
    res.status(500).json({ error: error.message });
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
    const deleted = await AssetRetirementModel.destroy({
      where: { id: assetRetirementId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Asset retirement not found" });
    }

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
    DocumentoAprobado,
    Descripcion,
    DestinoFinal,
    Fotografia,
    NumeroBoleta,
    Usuario,
  } = req.body;

  try {
    const [updated] = await AssetRetirementModel.update(
      {
        PlacaActivo,
        DocumentoAprobado,
        Descripcion,
        DestinoFinal,
        Fotografia,
        NumeroBoleta,
        Usuario,
      },
      {
        where: { id: assetRetirementId },
        returning: true,
      }
    );

    if (updated) {
      const updatedAssetRetirement = await AssetRetirementModel.findByPk(
        assetRetirementId
      );
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

// Método para obtener bajas de activos por el número de boleta
export const getAssetRetirementByNumeroBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params;

  try {
    const assetRetirement = await AssetRetirementModel.findOne({
      where: { NumeroBoleta },
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