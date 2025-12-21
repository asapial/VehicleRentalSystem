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

export const vehicleServices={
    createVehicleQuery,
    getAllVehicleQuery,
    getVehicleByIDQuery
}