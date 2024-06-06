import { Request, Response } from "express";
import EditAssetModel from "../models/editAssetModel";

// Método para guardar un activo editado
export const saveEditAsset = async (req: Request, res: Response) => {
  const { PlacaActivo, Descripcion, Fotografia, NumeroBoleta, Usuario } = req.body;

  try {
    const editedAsset = await EditAssetModel.create({
      PlacaActivo,
      Descripcion,
      Fotografia,
      NumeroBoleta,
      Usuario
    });

    res.status(201).json({ message: "Edited asset created successfully", data: editedAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todos los activos editados
// export const getEditAssets = async (req: Request, res: Response) => {
//   try {
//     const editedAssets = await EditAssetModel.findAll();
//     res.status(200).json({ message: "List of edited assets successful", data: editedAssets });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Método para eliminar un activo editado por ID
// export const deleteEditAsset = async (req: Request, res: Response) => {
//   const editAssetId = req.params.id;

//   try {
//     const deleted = await EditAssetModel.destroy({
//       where: { id: editAssetId },
//     });

//     if (deleted === 0) {
//       return res.status(404).json({ message: "Edited asset not found" });
//     }

//     res.status(200).json({ message: "Delete edited asset successful" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Método para actualizar un activo editado
// export const updateEditAsset = async (req: Request, res: Response) => {
//   const editAssetId = req.params.id;
//   const { Descripcion, Fotografia, NumeroBoleta, Usuario } = req.body;

//   try {
//     const [updated] = await EditAssetModel.update(
//       {
//         Descripcion,
//         Fotografia,
//         NumeroBoleta,
//         Usuario
//       },
//       {
//         where: { id: editAssetId },
//         returning: true,
//       }
//     );

//     if (updated) {
//       const updatedEditAsset = await EditAssetModel.findByPk(editAssetId);
//       res
//         .status(200)
//         .json({ message: "Update edited asset successful", data: updatedEditAsset });
//     } else {
//       res.status(404).json({ message: "Edited asset not found" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
