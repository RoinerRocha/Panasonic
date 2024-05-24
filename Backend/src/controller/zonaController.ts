import { Request, Response } from "express";
import ZonaModels from "../models/zonaModels";

//Metodo para guardar Zona
export const saveZona = async (req: Request, res: Response) => {
  const { numeroZona, nombreZona, responsableAreaNom_user } = req.body;

  try {
    const zona = await ZonaModels.create({
      numeroZona,
      nombreZona,
      responsableAreaNom_user,
    });

    res.status(201).json({ message: "Zone created successfully", user: zona });
  } catch (error: any) {
    // Aquí especificamos el tipo de 'error' como 'any'
    res.status(500).json({ error: error.message });
  }
};

// metodo para obtener zonas
export const getZona = async (req: Request, res: Response) => {
  try {
    const zonas = await ZonaModels.findAll();
    res.status(200).json({ message: "List of Zone successful", data: zonas });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar una zona por ID
export const deleteZona = async (req: Request, res: Response) => {
  const zonaId = req.params.id;

  try {
    //const user = await User.findByPk(userId);
    const zona = await ZonaModels.destroy({
      where: { id: zonaId },
    });

    if (zona === null) {
      return res.status(404).json({ message: "Zona not found" });
    }

    res.status(200).json({ message: "Delete Zona successful: ", data: zona });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Metodo para actualizar zona
export const updateZona = async (req: Request, res: Response) => {
  const zonaId = req.params.id;
  const { numeroZona, nombreZona, responsableAreaNom_user } = req.body;

  try {
    const [updated] = await ZonaModels.update(
      { numeroZona, nombreZona, responsableAreaNom_user },
      {
        where: { id: zonaId },
        returning: true,
      }
    );

    if (updated) {
      const updatedZona = await ZonaModels.findByPk(zonaId);
      res
        .status(200)
        .json({ message: "Update Zona successful", data: updatedZona });
    } else {
      res.status(404).json({ message: "Zona not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
