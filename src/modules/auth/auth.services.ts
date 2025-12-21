import { pool } from "../../config/db"
import express from "express";

const createUserQuery = async (req:express.Request)=>{
    const { name , email, password, phone, role} = req.body;
    const result= await pool.query(`
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [name , email, password, phone, role]);

    return result;
}

export const authService ={
    createUserQuery
}