import express from 'express';
import { authService } from './auth.services';

const signup = async (req: express.Request, res: express.Response) => {

    const { name, email, password, phone, role } = req.body;

    try {

        const result = await authService.createUserQuery(req);

        console.log(result);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result.rows[0]
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const authController = {
    signup
}