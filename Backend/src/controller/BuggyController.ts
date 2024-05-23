import { Request, Response } from 'express';
import { BaseApiController } from './BaseApiController'; 

export class BuggyController extends BaseApiController {
    constructor() {
        super();
    }

    public getNotFound(req: Request, res: Response): void {
        res.status(404).json({ message: "Usuario no encontrado" });
    }

    public getBadRequest(req: Request, res: Response): void {
        res.status(400).json({ message: "Bad request" });
    }

    public getUnauthorised(req: Request, res: Response): void {
        res.status(401).json({ message: "Contraseña Invalida" });
    }

    public getValidationError(req: Request, res: Response): void {
        res.status(422).json({
            errors: {
                Problem1: ["This is the first error"],
                Problem2: ["This is the second error"]
            }
        });
    }

    public getServerError(req: Request, res: Response): void {
        res.status(500).json({ message: "Server error" });
    }
}