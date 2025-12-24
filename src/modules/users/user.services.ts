import { pool } from "../../config/db";
import express from "express";


const getAllUsersQuery = async () => {
    const result = pool.query(`
        SELECT id, name, email, phone, role
        FROM users
    `);

    return result;
}


const updateUserByIdQuery = async (req: express.Request) => {
        const id = Number(req.params.id);
    const result = await pool.query(`UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), role = COALESCE($4, role) WHERE id = $5 RETURNING *`, [req.body.name, req.body.email, req.body.phone, req.body.role,  id]);
    return result;
}

const deleteUserByIDQuery = async (req:express.Request)=>{

    const id : any=req.params.id;

    const result= await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    return result;
}

const checkUserWithActiveBookings= async (id:any) => {
    
    const result = await pool.query(`
        SELECT * FROM   bookings WHERE customer_id=$1
        `,[id]);

    return result;
}





export const userServices = {
    getAllUsersQuery,
    updateUserByIdQuery,
    deleteUserByIDQuery,
    checkUserWithActiveBookings
}