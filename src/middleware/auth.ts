
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const authMiddleware = (...roles: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Authorization token missing"
                });
            }

            const token: any = authHeader.split(" ")[1];

            if (!config.jwtSecret) {
                throw new Error("JWT secret not configured");
            }

            const decoded = jwt.verify(
                token,
                config.jwtSecret
            ) as JwtPayload;

            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                });
            }

            next();

        } catch (err: any) {
            return res.status(401).json({
                success: false,
                message:
                    err.name === "JsonWebTokenError"
                        ? "Invalid token"
                        : "Authentication failed"
            });
        }
    };
};

export const auth = authMiddleware;



