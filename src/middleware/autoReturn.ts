import express, { NextFunction } from 'express'
import { autoReturnBookings } from '../services/autoReturn.service';

export const autoReturn = async (req: express.Request, res: express.Response, next: NextFunction) => {
   
    await autoReturnBookings();

    next();
}

