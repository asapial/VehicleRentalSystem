import express from 'express';
import { authService } from './auth.services';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const signup = async (req: express.Request, res: express.Response) => {


try {
    const result = await authService.createUserQuery(req);

    const { password, created_at, ...returnedUser } = result.rows[0];

    return res.status(201).json({
        success: true,
        message: "User registered  successfully",
        data: returnedUser
    });

} catch (err: any) {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        errors: err.message
    });
}

}


const signIn = async (req: express.Request, res: express.Response) => {


    const { email, password } = req.body;

try {
    const result = await authService.signInUserQuery(req);

    // 404 – User not found
    if (result.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            errors: "No account exists with the provided credentials"
        });
    }

    const user = result.rows[0];

    // 401 – Invalid password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            errors: "Invalid email or password"
        });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret!,
        { expiresIn: "1d" }
    );

    const { password: _, created_at, ...returnedUser } = user;

    // Attach decoded user to request (for downstream middlewares if needed)
    req.user = jwt.verify(jwtToken, config.jwtSecret!) as JwtPayload;

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token: jwtToken,
            user: returnedUser
        }
    });

} catch (err: any) {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        errors: err.message
    });
}

}


export const authController = {
    signup,
    signIn
}