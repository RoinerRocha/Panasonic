import { Request, Response } from 'express';
import sequelize from '../Services/Postgresql'; 
import { Model } from 'sequelize/types'; 

export class BaseApiController {
    protected readonly _context: typeof sequelize; 

    constructor() {
        this._context = sequelize; 
    }
}