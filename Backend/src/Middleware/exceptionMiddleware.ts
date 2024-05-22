import { Request, Response, NextFunction } from 'express';
import { logger } from '../util/logger';

export const exceptionMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack); // Registra el error

    res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: req.app.get('env') === 'development' ? err.stack : undefined 
    });
};