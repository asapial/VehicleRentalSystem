import { pool } from "../../config/db"
import express from "express";
import bcrypt from "bcryptjs";


const createUserQuery = async (req:express.Request)=>{
    const { name , email, password, phone, role} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result= await pool.query(`
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [name , email, hashedPassword, phone, role]);

    return result;
}


const signInUserQuery = async (req:express.Request)=>{
    const {email}=req.body;

    const result= await pool.query('SELECT * FROM users WHERE email=$1', [email]);

    return result;
}

export const authService ={
    createUserQuery,
    signInUserQuery
}

