import { Request, Response } from "express";
import NewAssetModel from "../models/newAssetModel";
import axios from 'axios';
// Método para guardar un nuevo activo
export const saveNewAsset = async (req: Request, res: Response) => {
  const {
    CodigoCuenta,
    Zona,
    Tipo,
    Estado,
    Descripcion,
    NumeroPlaca,
    ValorCompraCRC,
    ValorCompraUSD,
    Fotografia,
    NombreProveedor,
    FechaCompra,
    FacturaNum,
    FacturaImagen,
    OrdenCompraNum,
    OrdenCompraImagen,
    NumeroAsiento,
    NumeroBoleta,
    Usuario
  } = req.body;

  try {
    const newAsset = await NewAssetModel.create({
      CodigoCuenta,
      Zona,
      Tipo,
      Estado,
      Descripcion,
      NumeroPlaca,
      ValorCompraCRC,
      ValorCompraUSD,
      Fotografia,
      NombreProveedor,
      FechaCompra,
      FacturaNum,
      FacturaImagen,
      OrdenCompraNum,
      OrdenCompraImagen,
      NumeroAsiento,
      NumeroBoleta,
      Usuario
    });

    res.status(201).json({ message: "New asset created successfully", data: newAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para obtener todos los nuevos activos
export const getNewAssets = async (req: Request, res: Response) => {
  try {
    const newAssets = await NewAssetModel.findAll();
    res.status(200).json({ message: "List of new assets successful", data: newAssets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Método para eliminar un nuevo activo por ID por si acaso
 export const deleteNewAsset = async (req: Request, res: Response) => {
   const newAssetId = req.params.id;

   try {
     const deleted = await NewAssetModel.destroy({
       where: { id: newAssetId },
     });

     if (deleted === 0) {
       return res.status(404).json({ message: "New asset not found" });
     }

     res.status(200).json({ message: "Delete new asset successful" });
   } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
 };

// Método para actualizar un nuevo activo
export const updateNewAsset = async (req: Request, res: Response) => {
  const newAssetId = req.params.id;
  const {
    CodigoCuenta,
    Zona,
    Tipo,
    Estado,
    Descripcion,
    NumeroPlaca,
    ValorCompraCRC,
    ValorCompraUSD,
    Fotografia,
    NombreProveedor,
    FechaCompra,
    FacturaNum,
    FacturaImagen,
    OrdenCompraNum,
    OrdenCompraImagen,
    NumeroAsiento,
    NumeroBoleta,
    Usuario
  } = req.body;

  try {
    const [updated] = await NewAssetModel.update(
      {
        CodigoCuenta,
        Zona,
        Tipo,
        Estado,
        Descripcion,
        NumeroPlaca,
        ValorCompraCRC,
        ValorCompraUSD,
        Fotografia,
        NombreProveedor,
        FechaCompra,
        FacturaNum,
        FacturaImagen,
        OrdenCompraNum,
        OrdenCompraImagen,
        NumeroAsiento,
        NumeroBoleta,
        Usuario
      },
      {
        where: { id: newAssetId },
        returning: true,
      }
    );

    if (updated) {
      const updatedNewAsset = await NewAssetModel.findByPk(newAssetId);
      res
        .status(200)
        .json({ message: "Update new asset successful", data: updatedNewAsset });
    } else {
      res.status(404).json({ message: "New asset not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
