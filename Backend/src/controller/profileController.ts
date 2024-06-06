import { Request, Response } from "express";
import ProfilesModel from "../models/profilesModel";

// Método para guardar un perfil
export const saveProfile = async (req: Request, res: Response) => {
  const { nombre, permisoAcceso } = req.body;

  try {
    const profile = await ProfilesModel.create({
      nombre,
      permisoAcceso,
    });

    res.status(201).json({ message: "Profile created successfully", data: profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todos los perfiles
export const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await ProfilesModel.findAll();
    res.status(200).json({ message: "List of profiles successful", data: profiles });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar un perfil por ID
export const deleteProfile = async (req: Request, res: Response) => {
  const profileId = req.params.id;

  try {
    const deleted = await ProfilesModel.destroy({
      where: { id: profileId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Delete profile successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar un perfil
export const updateProfile = async (req: Request, res: Response) => {
  const profileId = req.params.id;
  const { nombre, permisoAcceso } = req.body;

  try {
    const [updated] = await ProfilesModel.update(
      { nombre, permisoAcceso },
      {
        where: { id: profileId },
        returning: true,
      }
    );

    if (updated) {
      const updatedProfile = await ProfilesModel.findByPk(profileId);
      res
        .status(200)
        .json({ message: "Update profile successful", data: updatedProfile });
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};