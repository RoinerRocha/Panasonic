import NewAssetModel from "../models/newAssetModel";
import SalesAssetsModel from "../models/salesAssetsModel";
import AssetRetirementModel  from "../models/assetRetirementModel";


export const getHistorial = async () => {
  try {
    const newAssetsHistorial = await NewAssetModel.findAll();
    const salesAssetsHistorial = await SalesAssetsModel.findAll();
    const assetRetirementHistorial = await AssetRetirementModel.findAll();

    return {
      newAssetsHistorial,
      salesAssetsHistorial,
      assetRetirementHistorial
    };
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    throw error;
  }
};