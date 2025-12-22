
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const authMiddleware = (...roles: string[]) => {

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const authorizationToken = req.headers.authorization?.split(" ")[1];

        if (!authorizationToken) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }


        const decoded = jwt.verify(authorizationToken, config.jwtSecret!) as JwtPayload;
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role as string)) {
            return res.status(500).json({
                error: "unauthorized!!!",
            });
        }

        console.log("reqUser:", req.user);

        next();

    }
}

export const auth = authMiddleware;