import { Request, Response } from 'express';
import path from 'path';

export const uploadImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // La ruta al archivo cargado
    const filePath = path.resolve('fotografias', req.file.filename);

    res.status(200).send({
        message: 'File uploaded successfully',
        filePath: filePath
    });
};