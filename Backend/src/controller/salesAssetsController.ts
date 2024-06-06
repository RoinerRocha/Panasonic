import { Request, Response } from "express";
import SalesAssetsModel from "../models/salesAssetsModel";

// Método para guardar la venta de un activo
export const saveSalesAsset = async (req: Request, res: Response) => {
  const { PlacaActivo, DocumentoAprobado, Descripcion, MontoVentas, CotizacionVentas, Fotografia, Comprobante, NumeroBoleta, Usuario } = req.body;

  try {
    const salesAsset = await SalesAssetsModel.create({
      PlacaActivo,
      DocumentoAprobado,
      Descripcion,
      MontoVentas,
      CotizacionVentas,
      Fotografia,
      Comprobante,
      NumeroBoleta,
      Usuario
    });

    res.status(201).json({ message: "Sales asset created successfully", data: salesAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todas las ventas de activos
// export const getSalesAssets = async (req: Request, res: Response) => {
//   try {
//     const salesAssets = await SalesAssetsModel.findAll();
//     res.status(200).json({ message: "List of sales assets successful", data: salesAssets });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Método para eliminar una venta de activo por ID
// export const deleteSalesAsset = async (req: Request, res: Response) => {
//   const salesAssetId = req.params.id;

//   try {
//     const deleted = await SalesAssetsModel.destroy({
//       where: { id: salesAssetId },
//     });

//     if (deleted === 0) {
//       return res.status(404).json({ message: "Sales asset not found" });
//     }

//     res.status(200).json({ message: "Delete sales asset successful" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Método para actualizar una venta de activo
// export const updateSalesAsset = async (req: Request, res: Response) => {
//   const salesAssetId = req.params.id;
//   const { PlacaActivo, DocumentoAprobado, Descripcion, MontoVentas, CotizacionVentas, Fotografia, Comprobante, NumeroBoleta, Usuario } = req.body;

//   try {
//     const [updated] = await SalesAssetsModel.update(
//       {
//         PlacaActivo,
//         DocumentoAprobado,
//         Descripcion,
//         MontoVentas,
//         CotizacionVentas,
//         Fotografia,
//         Comprobante,
//         NumeroBoleta,
//         Usuario
//       },
//       {
//         where: { id: salesAssetId },
//         returning: true,
//       }
//     );

//     if (updated) {
//       const updatedSalesAsset = await SalesAssetsModel.findByPk(salesAssetId);
//       res
//         .status(200)
//         .json({ message: "Update sales asset successful", data: updatedSalesAsset });
//     } else {
//       res.status(404).json({ message: "Sales asset not found" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
