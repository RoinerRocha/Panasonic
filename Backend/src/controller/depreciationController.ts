import { Request, Response } from "express";
import DepreciationModel from "../models/depreciationModel";

// Método para guardar una depreciación
export const saveDepreciation = async (req: Request, res: Response) => {
  const { Codigo, Cuenta, Descripcion, Dolares, Colones, Clasificacion } = req.body;

  try {
    const depreciation = await DepreciationModel.create({
      Codigo,
      Cuenta,
      Descripcion,
      Dolares,
      Colones,
      Clasificacion,
    });

    res.status(201).json({ message: "Depreciation created successfully", data: depreciation });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todas las depreciaciones
export const getDepreciations = async (req: Request, res: Response) => {
  try {
    const depreciations = await DepreciationModel.findAll();
    res.status(200).json({ message: "List of depreciations successful", data: depreciations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar una depreciación por ID
export const deleteDepreciation = async (req: Request, res: Response) => {
  const depreciationId = req.params.id;

  try {
    const deleted = await DepreciationModel.destroy({
      where: { id: depreciationId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Depreciation not found" });
    }

    res.status(200).json({ message: "Delete depreciation successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar una depreciación
export const updateDepreciation = async (req: Request, res: Response) => {
  const depreciationId = req.params.id;
  const { Codigo, Cuenta, Descripcion, Dolares, Colones, Clasificacion } = req.body;

  try {
    const [updated] = await DepreciationModel.update(
      { Codigo, Cuenta, Descripcion, Dolares, Colones, Clasificacion },
      {
        where: { id: depreciationId },
        returning: true,
      }
    );

    if (updated) {
      const updatedDepreciation = await DepreciationModel.findByPk(depreciationId);
      res.status(200).json({ message: "Update depreciation successful", data: updatedDepreciation });
    } else {
      res.status(404).json({ message: "Depreciation not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
