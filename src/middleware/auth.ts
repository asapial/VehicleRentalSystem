
import express from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const authMiddleware=()=>{

    return (req: express.Request, res:express.Response, next:express.NextFunction)=>{

        const authorizationToken= req.headers.authorization?.split(" ")[1];

        if(!authorizationToken){
            return res.status(401).json({
                success:false,
                message:"No token provided"
            });
        }

        
        // const decoded = jwt.verify(authorizationToken, config.jwtSecret!);
        // req.user = decoded;

        // console.log("reqUser:", req.user);

        next();

    }
}