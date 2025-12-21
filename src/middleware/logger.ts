
import express, { NextFunction } from 'express'

export  const logger=(req:express.Request, res:express.Response,next: NextFunction)=>{

  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
}