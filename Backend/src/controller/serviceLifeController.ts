import { Request, Response } from "express";
import ServiceLifeModels from "../models/serviceLifeModel";

// Método para guardar el ciclo de vida util
export const saveServiceLife = async (req: Request, res: Response) => {
  const { tipo, añoUtil } = req.body;

  try {
    const serviceLife = await ServiceLifeModels.create({
      tipo,
      añoUtil,
    });

    res.status(201).json({ message: "Service life created successfully", data: serviceLife });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todos los ciclos de vida util
export const getServiceLifes = async (req: Request, res: Response) => {
  try {
    const serviceLifes = await ServiceLifeModels.findAll();
    res.status(200).json({ message: "List of service lifes successful", data: serviceLifes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar un ciclo de vida util por ID
export const deleteServiceLife = async (req: Request, res: Response) => {
  const serviceLifeId = req.params.id;

  try {
    const deleted = await ServiceLifeModels.destroy({
      where: { id: serviceLifeId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Service life not found" });
    }

    res.status(200).json({ message: "Delete service life successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar un ciclo de vida util
export const updateServiceLife = async (req: Request, res: Response) => {
  const serviceLifeId = req.params.id;
  const { tipo, añoUtil } = req.body;

  try {
    const [updated] = await ServiceLifeModels.update(
      { tipo, añoUtil },
      {
        where: { id: serviceLifeId },
        returning: true,
      }
    );

    if (updated) {
      const updatedServiceLife = await ServiceLifeModels.findByPk(serviceLifeId);
      res
        .status(200)
        .json({ message: "Update service life successful", data: updatedServiceLife });
    } else {
      res.status(404).json({ message: "Service life not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
