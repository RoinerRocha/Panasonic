import { Request, Response } from "express";
import NewAccesModel from "../models/accessModel";

// Obtener todos los accesos
export const getAllAccesses = async (req: Request, res: Response) => {
  try {
    const accesses = await NewAccesModel.findAll();
    res.status(200).json({ message: "List of all accesses retrieved successfully", data: accesses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un nuevo acceso
export const addNewAccess = async (req: Request, res: Response) => {
  const { Acceso } = req.body;

  try {
    const newAccess = await NewAccesModel.create({ Acceso });
    res.status(201).json({ message: "New access added successfully", data: newAccess });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un acceso existente
export const updateAccess = async (req: Request, res: Response) => {
  const accessId = req.params.id;
  const { Acceso } = req.body;

  try {
    const [updated] = await NewAccesModel.update(
      { Acceso },
      {
        where: { id: accessId },
        returning: true,
      }
    );

    if (updated) {
      const updatedAccess = await NewAccesModel.findByPk(accessId);
      res.status(200).json({ message: "Access updated successfully", data: updatedAccess });
    } else {
      res.status(404).json({ message: "Access not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un acceso
export const deleteAccess = async (req: Request, res: Response) => {
  const accessId = req.params.id;

  try {
    const deleted = await NewAccesModel.destroy({
      where: { id: accessId },
    });

    if (deleted) {
      res.status(200).json({ message: "Access deleted successfully" });
    } else {
      res.status(404).json({ message: "Access not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
