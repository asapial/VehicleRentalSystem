import express from "express";
import { vehicleServices } from "./vehicles.services";


const createVehicle = async (req: express.Request, res: express.Response) => {

    try {
        const result = await vehicleServices.createVehicleQuery(req);
        res.status(201).json({
            success: true,
            message: "Vehicle  created successfully",
            data: result.rows[0]
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getAllVehicle = async (req: express.Request, res: express.Response) => {

    try {
        const result = await vehicleServices.getAllVehicleQuery();


        if (result.rows.length === 0) {
            return res.status(200).json(
                {
                    "success": true,
                    "message": "No vehicles found",
                    "data": []
                }
            )
        }
        res.status(201).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getVehicleByID = async (req: express.Request, res: express.Response) => {

 
    try {
        const result = await vehicleServices.getVehicleByIDQuery(req);


        if (result.rows.length === 0) {
            return res.status(200).json(
                {
                    "success": true,
                    "message": "No vehicles found",
                    "data": []
                }
            )
        }
        res.status(201).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateVehicleByID = async (req: express.Request, res: express.Response) => {

 
    try {
        const result = await vehicleServices.updateVehicleByIDQuery(req);


        if (result.rows.length === 0) {
            return res.status(200).json(
                {
                    "success": true,
                    "message": "No vehicles found",
                    "data": []
                }
            )
        }
        res.status(201).json({
            success: true,
            message: "Vehicle updated  successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const vehicleController = {
    createVehicle,
    getAllVehicle,
    getVehicleByID,
    updateVehicleByID
}