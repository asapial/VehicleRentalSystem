import express from "express";
import { vehicleServices } from "./vehicles.services";


const createVehicle = async (req: express.Request, res: express.Response) => {

    try {
        const result = await vehicleServices.createVehicleQuery(req);

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }

}

const getAllVehicle = async (req: express.Request, res: express.Response) => {

    try {
        const result = await vehicleServices.getAllVehicleQuery();

        // 200 – OK (empty list is still a successful response)
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            });
        }

        // 200 – OK (GET request must not return 201)
        return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const getVehicleByID = async (req: express.Request, res: express.Response) => {

    try {
        const result = await vehicleServices.getVehicleByIDQuery(req);

        // 404 – Not Found (resource does not exist)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "No vehicle exists with the provided ID"
            });
        }

        // 200 – OK (successful GET)
        return res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }

}

const updateVehicleByID = async (req: express.Request, res: express.Response) => {


    try {
        const result = await vehicleServices.updateVehicleByIDQuery(req);

        // 404 – Not Found (nothing to update)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "No vehicle exists with the provided ID"
            });
        }

        // 200 – OK (successful UPDATE)
        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }

}


const deleteVehicleByID = async (req: express.Request, res: express.Response) => {


    try {
        const result = await vehicleServices.deleteVehicleByIDQuery(req);

        // 404 – Not Found
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "No vehicle exists with the provided ID"
            });
        }

        // 200 – OK (successful DELETE)
        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
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

export const vehicleController = {
    createVehicle,
    getAllVehicle,
    getVehicleByID,
    updateVehicleByID,
    deleteVehicleByID
}