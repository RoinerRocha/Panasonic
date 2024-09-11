  import { Request, Response } from "express";
  import NewAssetModel from "../models/newAssetModel";
  import axios from 'axios';
  import FormData from 'form-data';
  import fs from 'fs';
  import { writeFileSync, unlink } from "fs";
  import multer from 'multer';
  import { Op } from "sequelize";
  import { upload } from '../Middleware/multerConfig'
  import Joi from 'joi';
  import path from 'path';
  import { Document, Packer, Paragraph, TextRun } from "docx";
  import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
  import ExcelJS from "exceljs";
import NewAccesModel from "../models/accessModel";
  
  interface MulterFiles {
    Fotografia?: Express.Multer.File[];
    OrdenCompraImagen?: Express.Multer.File[];
    FacturaImagen?: Express.Multer.File[];
  }
  
  const deleteFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      } else {
        console.log(`File deleted: ${filePath}`);
      }
    });
  };

  export const generateMultipleExcelFiles = async (req: Request, res: Response) => {
    const assetIds: number[] = req.body.ids; // Asegúrate de enviar un array de IDs en el body de la petición
  
    try {
      const assets = await NewAssetModel.findAll({
        where: {
          id: {
            [Op.in]: assetIds, // Selecciona los activos cuyo ID está en el array proporcionado
          },
        },
      });
  
      if (assets.length === 0) {
        return res.status(404).json({ message: "No assets found" });
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Assets Information");
  
      worksheet.columns = [
        { header: "Codigo Cuenta", key: "code", width: 30 },
        { header: "Zona", key: "zone", width: 30 },
        { header: "Tipo", key: "type", width: 30 },
        { header: "Estado", key: "state", width: 30 },
        { header: "Descripcion", key: "description", width: 30 },
        { header: "Numero Placa", key: "number", width: 30 },
        { header: "Valor Compra CRC", key: "crc", width: 30 },
        { header: "Valor Compra USD", key: "usd", width: 30 },
        { header: "Nombre Proveedor", key: "provider", width: 30 },
        { header: "Fecha Compra", key: "date", width: 30 },
        { header: "Factura Num", key: "facture", width: 30 },
        { header: "Numero Asiento", key: "seat", width: 30 },
        { header: "Numero Boleta", key: "ballot", width: 30 },
        { header: "Usuario", key: "user", width: 30 },
      ];
  
      // Añadir los datos de cada activo en una nueva fila
      assets.forEach(asset => {
        const assetData = {
          code: asset.CodigoCuenta,
          zone: asset.Zona,
          type: asset.Tipo,
          state: asset.Estado,
          description: asset.Descripcion,
          number: asset.NumeroPlaca,
          crc: asset.ValorCompraCRC,
          usd: asset.ValorCompraUSD,
          provider: asset.NombreProveedor,
          date: asset.FechaCompra,
          facture: asset.FacturaNum,
          seat: asset.NumeroAsiento,
          ballot: asset.NumeroBoleta,
          user: asset.Usuario,
        };
  
        const row = worksheet.addRow(assetData);
        row.alignment = { vertical: 'middle', horizontal: 'center' };
      });
  
      const filePath = `./uploads/Assets.xlsx`;
      await workbook.xlsx.writeFile(filePath);
  
      res.download(filePath, `Assets.xlsx`, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading file" });
        }
        unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const generateExcelFile = async (req: Request, res: Response) => {
    const newAssetId = req.params.id;
  
    try {
      const asset = await NewAssetModel.findByPk(newAssetId);
  
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Asset Information");
  
      worksheet.columns = [
        { header: "Codigo Cuenta", key: "code", width: 30 },
        { header: "Zona", key: "zone", width: 30 },
        { header: "Tipo", key: "type", width: 30 },
        { header: "Estado", key: "state", width: 30 },
        { header: "Descripcion", key: "description", width: 30 },
        { header: "Numero Placa", key: "number", width: 30 },
        { header: "Valor Compra CRC", key: "crc", width: 30 },
        { header: "Valor Compra USD", key: "usd", width: 30 },
        { header: "Nombre Proveedor", key: "provider", width: 30 },
        { header: "Fecha Compra", key: "date", width: 30 },
        { header: "Factura Num", key: "facture", width: 30 },
        { header: "Numero Asiento", key: "seat", width: 30 },
        { header: "Numero Boleta", key: "ballot", width: 30 },
        { header: "Usuario", key: "user", width: 30 },
      ];
  
      const assetData = {
        code: asset.CodigoCuenta,
        zone: asset.Zona,
        type: asset.Tipo,
        state: asset.Estado,
        description: asset.Descripcion,
        number: asset.NumeroPlaca,
        crc: asset.ValorCompraCRC,
        usd: asset.ValorCompraUSD,
        provider: asset.NombreProveedor,
        date: asset.FechaCompra,
        facture: asset.FacturaNum,
        seat: asset.NumeroAsiento,
        ballot: asset.NumeroBoleta,
        user: asset.Usuario,
      };
  
      const row = worksheet.addRow(assetData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
  
      const filePath = `./uploads/Asset_${asset.NumeroBoleta}.xlsx`;
      await workbook.xlsx.writeFile(filePath);
  
      res.download(filePath, `Asset_${asset.NumeroBoleta}.xlsx`, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading file" });
        }
        unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  


  // Método para generar un archivo Word con los datos del activo
export const generateWordFile = async (req: Request, res: Response) => {
  const newAssetId = req.params.id;

  try {
    const asset = await NewAssetModel.findByPk(newAssetId);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Informacion del activo",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph(`Codigo Cuenta: ${asset.CodigoCuenta}`),
            new Paragraph(`Zona: ${asset.Zona}`),
            new Paragraph(`Tipo: ${asset.Tipo}`),
            new Paragraph(`Estado: ${asset.Estado}`),
            new Paragraph(`Descripcion: ${asset.Descripcion}`),
            new Paragraph(`Numero Placa: ${asset.NumeroPlaca}`),
            new Paragraph(`Valor Compra CRC: ${asset.ValorCompraCRC}`),
            new Paragraph(`Valor Compra USD: ${asset.ValorCompraUSD}`),
            new Paragraph(`Nombre Proveedor: ${asset.NombreProveedor}`),
            new Paragraph(`Fecha Compra: ${asset.FechaCompra}`),
            new Paragraph(`Factura Num: ${asset.FacturaNum}`),
            new Paragraph(`Numero Asiento: ${asset.NumeroAsiento}`),
            new Paragraph(`Numero Boleta: ${asset.NumeroBoleta}`),
            new Paragraph(`Usuario: ${asset.Usuario}`),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = `./uploads/Asset_${asset.NumeroBoleta}.docx`;
    writeFileSync(filePath, buffer);

    res.download(filePath, `Asset_${asset.NumeroBoleta}.docx`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }

      // Optionally delete the file after download
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

  // Método para generar un archivo PDF con los datos del activo
export const generatePDFFile = async (req: Request, res: Response) => {
  const newAssetId = req.params.id;

  try {
    const asset = await NewAssetModel.findByPk(newAssetId);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);
    const { width, height } = page.getSize();
    const fontSize = 20;

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    page.drawText('Asset Information', {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    const assetData = [
      `Codigo Cuenta: ${asset.CodigoCuenta}`,
      `Zona: ${asset.Zona}`,
      `Tipo: ${asset.Tipo}`,
      `Estado: ${asset.Estado}`,
      `Descripcion: ${asset.Descripcion}`,
      `Numero Placa: ${asset.NumeroPlaca}`,
      `Valor Compra CRC: ${asset.ValorCompraCRC}`,
      `Valor Compra USD: ${asset.ValorCompraUSD}`,
      `Nombre Proveedor: ${asset.NombreProveedor}`,
      `Fecha Compra: ${asset.FechaCompra}`,
      `Factura Num: ${asset.FacturaNum}`,
      `Numero Asiento: ${asset.NumeroAsiento}`,
      `Numero Boleta: ${asset.NumeroBoleta}`,
      `Usuario: ${asset.Usuario}`,
    ];

    let yPosition = height - 5 * fontSize;
    for (const line of assetData) {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize + 10;
    }

    const pdfBytes = await pdfDoc.save();
    const filePath = `./uploads/Asset_${asset.id}.pdf`;
    writeFileSync(filePath, pdfBytes);

    res.download(filePath, `Asset_${asset.id}.pdf`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }

      // Optionally delete the file after download
      unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
  
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
      NombreProveedor,
      FechaCompra,
      FacturaNum,
      OrdenCompraNum,
      NumeroAsiento,
      NumeroBoleta,
      Usuario
    } = req.body;

    const files = req.files as MulterFiles;

    const fotografiaPath = files?.Fotografia?.[0]?.path || null;
    const ordenCompraImagenPath = files?.OrdenCompraImagen?.[0]?.path || null;
    const facturaImagenPath = files?.FacturaImagen?.[0]?.path || null;

    try {
      const existingPlacaNum = await NewAssetModel.findOne({ where: { NumeroPlaca } });
      if (existingPlacaNum ) {
        return res.status(400).json({ message: "El numero de placa ya existe" });
      }

      const existingFacturaNum = await NewAssetModel.findOne({ where: { FacturaNum } });
      if (existingFacturaNum) {
        return res.status(400).json({ message: "El numero de factura debe de ser diferente" });
      }

      const newAsset = await NewAssetModel.create({
        CodigoCuenta,
        Zona,
        Tipo,
        Estado,
        Descripcion,
        NumeroPlaca,
        ValorCompraCRC,
        ValorCompraUSD,
        Fotografia: fotografiaPath,
        NombreProveedor,
        FechaCompra,
        FacturaNum,
        FacturaImagen: facturaImagenPath,
        OrdenCompraNum,
        OrdenCompraImagen: ordenCompraImagenPath,
        NumeroAsiento,
        NumeroBoleta,
        Usuario
      });

      res.status(201).json({ message: "New asset created successfully", data: newAsset });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Método para buscar activos por nombre de la zona
  export const searchAssetsByZona = async (req: Request, res: Response) => {
    const { zonaNombre } = req.query;  // Asegúrate de usar el nombre correcto para el parámetro de consulta
  
    if (typeof zonaNombre !== 'string') {
      return res.status(400).json({ message: "Invalid query parameter." });
    }
  
    try {
      // Asegúrate de que 'Zona' es el nombre correcto del campo en la base de datos
      const assets = await NewAssetModel.findAll({
        where: {
          Zona: {
            [Op.like]: `%${zonaNombre}%`
          }
        }
      });
  
      if (assets.length === 0) {
        return res.status(404).json({ message: "No assets found for the specified zone." });
      }
  
      res.status(200).json({ message: "Assets fetched successfully", data: assets });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
      const assetToDelete = await NewAssetModel.findByPk(newAssetId);
  
      if (!assetToDelete) {
        return res.status(404).json({ message: "New asset not found" });
      }
  
      // Eliminar archivos de imagen asociados
      if (assetToDelete.Fotografia) {
        deleteFile(path.resolve(assetToDelete.Fotografia));
      }
      if (assetToDelete.OrdenCompraImagen) {
        deleteFile(path.resolve(assetToDelete.OrdenCompraImagen));
      }
      if (assetToDelete.FacturaImagen) {
        deleteFile(path.resolve(assetToDelete.FacturaImagen));
      }
  
      // Eliminar el activo de la base de datos
      await NewAssetModel.destroy({
        where: { id: newAssetId },
      });
  
      res.status(200).json({ message: "Delete new asset successful" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Método para buscar un nuevo activo por ID por si acaso
  export const searchIdNewAsset = async (req: Request, res: Response) => {
    const newAssetId = req.params.id;
  
    try {
      const newAsset = await NewAssetModel.findByPk(newAssetId);

      if (!newAsset) {
        return res.status(404).json({ message: "Search New asset not found..." });
      }

      res.status(200).json({ message: "Search ID new asset successful", data: newAsset });
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
      NombreProveedor,
      FechaCompra,
      FacturaNum,
      OrdenCompraNum,
      NumeroAsiento,
      NumeroBoleta,
      Usuario
    } = req.body;
  
    const files = req.files as MulterFiles;
  
    const fotografiaPath = files?.Fotografia?.[0]?.path || null;
    const ordenCompraImagenPath = files?.OrdenCompraImagen?.[0]?.path || null;
    const facturaImagenPath = files?.FacturaImagen?.[0]?.path || null;
  
    try {
      const existingAsset = await NewAssetModel.findByPk(newAssetId);
  
      if (!existingAsset) {
        return res.status(404).json({ message: "New asset not found" });
      }
  
      const updateData: any = {
        CodigoCuenta,
        Zona,
        Tipo,
        Estado,
        Descripcion,
        NumeroPlaca,
        ValorCompraCRC,
        ValorCompraUSD,
        NombreProveedor,
        FechaCompra,
        FacturaNum,
        OrdenCompraNum,
        NumeroAsiento,
        NumeroBoleta,
        Usuario,
      };
  
      // Solo actualizar las rutas de las imágenes si se han subido nuevas imágenes
      if (fotografiaPath) {
        updateData.Fotografia = fotografiaPath;
      }
      if (ordenCompraImagenPath) {
        updateData.OrdenCompraImagen = ordenCompraImagenPath;
      }
      if (facturaImagenPath) {
        updateData.FacturaImagen = facturaImagenPath;
      }
  
      const [updated] = await NewAssetModel.update(updateData, {
        where: { id: newAssetId },
        returning: true,
      });
  
      if (updated) {
        // Eliminar las imágenes antiguas solo si se han subido nuevas imágenes
        if (fotografiaPath && existingAsset.Fotografia) {
          deleteFile(path.resolve(existingAsset.Fotografia));
        }
        if (ordenCompraImagenPath && existingAsset.OrdenCompraImagen) {
          deleteFile(path.resolve(existingAsset.OrdenCompraImagen));
        }
        if (facturaImagenPath && existingAsset.FacturaImagen) {
          deleteFile(path.resolve(existingAsset.FacturaImagen));
        }
  
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


  const numeroBoletaSchema = Joi.string().required().pattern(/^[A-Za-z]/);

export const getAssetRetirementByNumeroBoleta = async (req: Request, res: Response) => {
  const { NumeroBoleta } = req.params;

  try {
    await numeroBoletaSchema.validateAsync(NumeroBoleta);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid NumeroBoleta' });
  }

  try {
    const assetRetirement = await NewAssetModel.findAll({
      where: {
        NumeroBoleta: {
          [Op.like]: `${NumeroBoleta}%`,
        },
      },
    });

    if (assetRetirement.length >= 0) {
      res.status(200).json({
        message: "Asset retirements fetched successfully",
        data: assetRetirement,
      });
    } 
    else {
      res.status(404).json({ message: "Asset retirements not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

//Metodo para buscar una venta de activo mediante barra de busqueda
export const searchNewAssets = async (req: Request, res: Response) => {
  const { searchAsset } = req.query;

  try {
    const newAsset = await NewAssetModel.findAll({
      where: {
        [Op.or]: [
          { CodigoCuenta: { [Op.like]: `%${searchAsset}%` } },
          { Zona: { [Op.like]: `%${searchAsset}%` } },
          { Tipo: { [Op.like]: `%${searchAsset}%` } },
          { NumeroPlaca: { [Op.like]: `%${searchAsset}%` } },
          { NumeroBoleta: { [Op.like]: `%${searchAsset}%` } },
          { Usuario: { [Op.like]: `%${searchAsset}%` } },
        ],
      },
    });

    res.status(200).json({ message: "Search results fetched successfully", data: newAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Función para actualizar las posiciones de los activos
export const saveAssetPositions = async (req: Request, res: Response) => {
  const { assetPositions } = req.body; // Se Obtiene las posiciones del body

  if (!assetPositions) {
    return res.status(400).json({ error: 'Las posiciones de los activos son requeridas.' });
  }

  // Iterar sobre cada activo y actualizar su posición en la base de datos
  try {
    const queries = Object.keys(assetPositions).map((assetId) => {
      const { x, y } = assetPositions[assetId];
      
      // Actualizar la posición del activo usando el método `update` de Sequelize
      return NewAssetModel.update(
        { posX: x, posY: y },  // Campos a actualizar
        { where: { id: assetId } }  // Condición de actualización
      );
    });

    // Ejecutar todas las actualizaciones en paralelo
    await Promise.all(queries);

    return res.status(200).json({ message: 'Posiciones actualizadas correctamente.' });
  } catch (error) {
    console.error('Error al actualizar las posiciones:', error);
    return res.status(500).json({ error: 'Error al actualizar las posiciones.' });
  }
};