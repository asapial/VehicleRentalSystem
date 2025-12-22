import express from "express"
import { pool } from "../../config/db";

const createVehicleQuery = async (req:express.Request)=>{
    const { vehicle_name , type, registration_number, daily_rent_price, availability_status} = req.body;


    const result= await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [ vehicle_name , type, registration_number, daily_rent_price, availability_status]);

    return result;
}

const getAllVehicleQuery = async ()=>{
    const result= await pool.query(`
        SELECT * FROM vehicles 
        `)

    return result;
}

const getVehicleByIDQuery = async (req:express.Request)=>{

    const id : any=req.params.id;

    const result= await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

    return result;
}

const updateVehicleByIDQuery = async (req:express.Request)=>{
    const id: any= req.params.id;
    const result = await pool.query(`UPDATE vehicles SET vehicle_name = COALESCE($1, vehicle_name), type = COALESCE($2, type), registration_number = COALESCE($3, registration_number), daily_rent_price = COALESCE($4, daily_rent_price), availability_status = COALESCE($5, availability_status) WHERE id = $6 RETURNING *`, [req.body.vehicle_name, req.body.type, req.body.registration_number, req.body.daily_rent_price, req.body.availability_status, id]);
    return result;
}


export const vehicleServices={
    createVehicleQuery,
    getAllVehicleQuery,
    getVehicleByIDQuery,
    updateVehicleByIDQuery
}