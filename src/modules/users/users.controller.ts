import express from "express";
import { userServices } from "./user.services";
import { JwtPayload } from "jsonwebtoken";
import { usersRoute } from "./users.route.";
import { error } from "node:console";

const getAllUsers = async (req: express.Request, res: express.Response) => {

    try {
        const result = await userServices.getAllUsersQuery();

        // 200 – OK (empty list is still a successful response)
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }

}

const updateUserById = async (req: express.Request, res: express.Response) => {

    try {
        const tokenUser: any = req.user;

        // 403 – Forbidden: customer cannot update other users
        if (req.body.role === "customer" && tokenUser.id !== req.body.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                errors: "Customers can only update their own profile"
            });
        }

        // 403 – Forbidden: customer cannot update role
        if (tokenUser.role === "customer" && req.body.role) {
            return res.status(403).json({
                success: false,
                message: "Customers cannot update role",
                errors: "Role modification is restricted to admins"
            });
        }

        const result = await userServices.updateUserByIdQuery(req);

        // 404 – Not Found: user does not exist
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errors: "No user exists with the provided ID"
            });
        }

        const userData = result.rows[0];

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role
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

const deleteUserById = async (req: express.Request, res: express.Response) => {


    try {
        const result = await userServices.deleteUserByIDQuery(req);

        // 404 – Not Found: user does not exist
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errors: "No user exists with the provided ID"
            });
        }

        // 200 – OK: successful deletion
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }

};


export const usersControllers = {
    getAllUsers,
    updateUserById,
    deleteUserById
}