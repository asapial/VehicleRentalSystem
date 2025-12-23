import express from "express";
import { userServices } from "./user.services";
import { JwtPayload } from "jsonwebtoken";
import { usersRoute } from "./users.route.";
import { error } from "node:console";

const getAllUsers = async (req: express.Request, res: express.Response) => {

    try {
        const result = await userServices.getAllUsersQuery();


        if (result.rows.length === 0) {
            return res.status(200).json(
                {
                    "success": true,
                    "message": "No User found",
                    "data": []
                }
            )
        }
        res.status(200).json({
            success: true,
            message: "Users  retrieved successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateUserById = async (req: express.Request, res: express.Response) => {

    try {
        const tokenUser: any = req.user;


        console.log(tokenUser);



        if (req.body.role === "customer" && tokenUser.id != req.body.id) {
            return res.status(403).json({
                "success": false,
                "message": "Access denied"
            })
        }

        if (tokenUser.role === "customer" && req.body.role) {
            return res.status(403).json({
                success: false,
                message: "Customers cannot update role"
            });
        }

        const result = await userServices.updateUserByIdQuery(req);
        const userData = result.rows[0];


        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        
        res.status(200).json({
            success: true,
            message: "Users  updated  successfully",
            data: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role
            }
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteUserById = async (req: express.Request, res: express.Response) => {
    try {
        const result = await userServices.deleteUserByIDQuery(req);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User  not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User  deleted successfully"
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export const usersControllers = {
    getAllUsers,
    updateUserById,
    deleteUserById
}