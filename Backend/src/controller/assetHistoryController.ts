import NewAssetModel from "../models/newAssetModel";
import SalesAssetsModel from "../models/salesAssetsModel";
import AssetRetirementModel from "../models/assetRetirementModel";
import { Request, Response } from "express";
import User from "../models/user";
import path from "path";
import { Op } from "sequelize";
import { unlink } from "fs/promises";
import ExcelJS from "exceljs";
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
/**
 * Metodo ara mostrar el historial del usuario
 * @param req usuario. ejm: Maria
 * @param res 
 * @returns lista del historial, si existe ese usuario
 */
export const searchHistoryByUserName = async (req: Request, res: Response) => {
  const usuario = req.params.usuario;

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
    console.error("Error searching history by UserName:", error, " more details of error:",error.message);
    res.status(500).json({ message: "An error occurred while searching history", error: error.message });
  }
};

export const getHistoryForTipeUser = async (req: Request, res: Response) => {//falta terminarlo
  const tipoUser = "Maestro";//req.params.tipoUser;
  try {
    const lisUser = await User.findAll({ where: { perfil_asignado: tipoUser } })
        res.status(200).json({
        message: "successfully....",
        data: lisUser});

    
    
  } catch (error: any) {
    console.error("Error in getHistoryForTipeUser:", error, " more details of error:",error.message);
    res.status(500).json({ message: "An error occurred while searching history for getHistoryForTipeUser", error: error.message });
  }
};

// Método para subir un documento asociado a un NumeroBoleta
export const uploadDocumentByBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params; 
  const file = req.file; 

  if (!NumeroBoleta) {
    return res.status(400).json({ message: "NumeroBoleta is required" });
  }

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    
    const assetRetirement = await AssetRetirementModel.findOne({ where: { NumeroBoleta } });
    const salesAsset = await SalesAssetsModel.findOne({ where: { NumeroBoleta } });

    if (!assetRetirement && !salesAsset) {
      return res.status(404).json({ message: "No asset found with that NumeroBoleta" });
    }

    
    if (assetRetirement) {
      assetRetirement.DocumentoAprobado = file.filename;
      await assetRetirement.save();
      return res.status(200).json({ message: "Document uploaded successfully", data: assetRetirement });
    }

   
    if (salesAsset) {
      salesAsset.DocumentoAprobado = file.filename;
      await salesAsset.save();
      return res.status(200).json({ message: "Document uploaded successfully", data: salesAsset });
    }

  } catch (error: unknown) {
    console.error("Error uploading document by NumeroBoleta:", (error as Error).message);
    res.status(500).json({ message: "An error occurred while uploading the document", error: (error as Error).message });
  }
};

export const searchHistoryByNumeroBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params;

  if (!NumeroBoleta) {
    return res.status(400).json({ message: "NumeroBoleta is required" });
  }

  try {
    const newAssets = await NewAssetModel.findAll({
      where: { NumeroBoleta: { [Op.like]: `%${NumeroBoleta}%` } }
    });

    const salesAssets = await SalesAssetsModel.findAll({
      where: { NumeroBoleta: { [Op.like]: `%${NumeroBoleta}%` } }
    });

    const assetRetirements = await AssetRetirementModel.findAll({
      where: { NumeroBoleta: { [Op.like]: `%${NumeroBoleta}%` } }
    });

    const history = [...newAssets, ...salesAssets, ...assetRetirements];

    if (history.length === 0) {
      return res.status(404).json({ message: "No history found for the provided NumeroBoleta fragment" });
    }

    res.status(200).json({ message: "Search by NumeroBoleta fragment successful", data: history });
  } catch (error: any) {
    console.error("Error searching history by NumeroBoleta:", error);
    res.status(500).json({ message: "An error occurred while searching history", error: error.message });
  }
};



export const generateExcelFileByBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params; 
  const boletaList = NumeroBoleta.split(","); 

  try {
    const assetRetirements = await AssetRetirementModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.in]: boletaList
        }
      }
    });

    const salesAssets = await SalesAssetsModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.in]: boletaList
        }
      }
    });

    const newAssets = await NewAssetModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.in]: boletaList
        }
      }
    });

    if (assetRetirements.length === 0 && salesAssets.length === 0 && newAssets.length === 0) {
      return res.status(404).json({ message: "No se encontró el NumeroBoleta" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asset Information");

    worksheet.columns = [
      { header: "Placa", key: "placa", width: 30 },
      { header: "Descripción", key: "description", width: 30 },
      { header: "Numero de boleta", key: "ballotNumber", width: 30 },
      { header: "Estado de Aprobación", key: "approvalStatus", width: 30 },
      { header: "Usuario", key: "user", width: 30 },
      { header: "Fecha", key: "date", width: 20 },
      { header: "Destino final", key: "destination", width: 30 },
      { header: "Monto Ventas", key: "amount", width: 30 },
     
    ];

    const currentDate = new Date().toLocaleDateString(); // Obtener la fecha actual en formato corto

    // Preparar los datos y agregarlos a la hoja de Excel
    assetRetirements.forEach((assetRetirement) => {
      worksheet.addRow({
        placa: assetRetirement.PlacaActivo || 'N/A',
        description: assetRetirement.Descripcion || 'N/A',
        ballotNumber: assetRetirement.NumeroBoleta || 'N/A',
        destination: assetRetirement.DestinoFinal || 'N/A',
        user: assetRetirement.Usuario || 'N/A',
        amount: 'N/A',
        date: currentDate,
        approvalStatus: assetRetirement.DocumentoAprobado ? "Con Aprobacion" : "Sin Aprobacion"
      });
    });

    salesAssets.forEach((salesAsset) => {
      worksheet.addRow({
        placa: salesAsset.PlacaActivo || 'N/A',
        description: salesAsset.Descripcion || 'N/A',
        ballotNumber: salesAsset.NumeroBoleta || 'N/A',
        destination: 'N/A',
        user: salesAsset.Usuario || 'N/A',
        amount: salesAsset.MontoVentas || 'N/A',
        date: currentDate,
        approvalStatus: salesAsset.DocumentoAprobado ? "Con Aprobacion" : "Sin Aprobacion"
      });
    });

    newAssets.forEach((newAsset) => {
      worksheet.addRow({
        placa: newAsset.NumeroPlaca || 'N/A',
        description: newAsset.Descripcion || 'N/A',
        ballotNumber: newAsset.NumeroBoleta || 'N/A',
        destination: newAsset.Zona || 'N/A',
        user: newAsset.Usuario || 'N/A',
        amount: 'N/A',
        date: currentDate,
        approvalStatus: 'N/A'
      });
    });

    // Enviar el archivo como respuesta
    const fileBuffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=Boletas.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(fileBuffer);
  } catch (error: any) {
    console.error("Error al generar el archivo Excel:", error.message);
    res.status(500).json({ message: error.message });
  }
};