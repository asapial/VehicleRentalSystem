import express from 'express';
import { authService } from './auth.services';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const signup = async (req: express.Request, res: express.Response) => {


    try {

        const result = await authService.createUserQuery(req);

        console.log(result);
        const { password, created_at, ...returnedUser } = result.rows[0];

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: returnedUser
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const signIn = async (req: express.Request, res: express.Response) => {


    const { email, password } = req.body;

    try {

        const result = await authService.signInUserQuery(req);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let isPasswordValid = await bcrypt.compare(password, result.rows[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }

        const jwtToken  = jwt.sign(
            { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
            config.jwtSecret!,
            {
                expiresIn: '1d'
            });

        const { password: _, created_at, ...returnedUser } = result.rows[0];
        
        // req.user=jwtToken;
        req.user = jwt.verify(jwtToken, config.jwtSecret!) as JwtPayload;

        console.log(req.user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: jwtToken,
                user: returnedUser
            }
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const authController = {
    signup,
    signIn
}