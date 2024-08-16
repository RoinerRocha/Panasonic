import NewAssetModel from "../models/newAssetModel";
import SalesAssetsModel from "../models/salesAssetsModel";
import AssetRetirementModel from "../models/assetRetirementModel";
import { Request, Response } from "express";

/**
 * Método para obtener la lista/historial de la base de datos de ventas, bajas y nuevos activos
 * @param req 
 * @param res 
 */
export const getHistory = async (req: Request, res: Response) => {
  try {
    const newAssetsHistorial = await NewAssetModel.findAll();
    const salesAssetsHistorial = await SalesAssetsModel.findAll();
    const assetRetirementHistorial = await AssetRetirementModel.findAll();

    const historial = [
      ...newAssetsHistorial,
      ...salesAssetsHistorial,
      ...assetRetirementHistorial,
    ];

    res.status(200).json({ message: "Lista del historial obtenida", data: historial });
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    res.status(500).json({ message: "Error al obtener el historial", data: [] });
  }
};

export const searchHistoryByUserName = async (req: Request, res: Response) => {
  const usuario = req.params.Usuario;

  if (!usuario) {
    return res.status(400).json({ message: "UserName is required" });
  }

  try {
    //Se busca en los tres modelos usando 'userName'
    const newAssets = await NewAssetModel.findAll({ where: { Usuario: usuario } });
    const salesAssets = await SalesAssetsModel.findAll({ where: { Usuario: usuario } });
    const assetRetirements = await AssetRetirementModel.findAll({ where: { Usuario: usuario } });

    // Se combinaron todos los resultados
    const history = [...newAssets, ...salesAssets, ...assetRetirements];

    if (history.length === 0) {
      return res.status(404).json({ message: "No history found for the provided UserName" });
    }

    res.status(200).json({ message: "Search USERNAME History successful", data: history });
  } catch (error: any) {
    console.error("Error searching history by UserName:", error);
    res.status(500).json({ message: "An error occurred while searching history", error: error.message });
  }
};