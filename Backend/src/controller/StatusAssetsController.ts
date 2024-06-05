import { Request, Response } from "express";
import StatusAssetsModel from "../models/statusAssetsModel";

// Método para guardar un estado de activo
export const saveStatusAsset = async (req: Request, res: Response) => {
  const { status } = req.body;

  try {
    const statusAsset = await StatusAssetsModel.create({
      status,
    });

    res.status(201).json({ message: "Status asset created successfully", data: statusAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todos los estados de activos
export const getStatusAssets = async (req: Request, res: Response) => {
  try {
    const statusAssets = await StatusAssetsModel.findAll();
    res.status(200).json({ message: "List of status assets successful", data: statusAssets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar un estado de activo por ID
export const deleteStatusAsset = async (req: Request, res: Response) => {
  const statusAssetId = req.params.id;

  try {
    const deleted = await StatusAssetsModel.destroy({
      where: { id: statusAssetId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Status asset not found" });
    }

    res.status(200).json({ message: "Delete status asset successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar un estado de activo
export const updateStatusAsset = async (req: Request, res: Response) => {
  const statusAssetId = req.params.id;
  const { status } = req.body;

  try {
    const [updated] = await StatusAssetsModel.update(
      { status },
      {
        where: { id: statusAssetId },
        returning: true,
      }
    );

    if (updated) {
      const updatedStatusAsset = await StatusAssetsModel.findByPk(statusAssetId);
      res
        .status(200)
        .json({ message: "Update status asset successful", data: updatedStatusAsset });
    } else {
      res.status(404).json({ message: "Status asset not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
