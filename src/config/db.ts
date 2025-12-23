
import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
    connectionString: `${config.connectionString}`,

})


export const connectDB = async () => {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(15),
        role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(10) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
        `)


    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        
            id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
            status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT chk_rent_dates CHECK (rent_end_date > rent_start_date)
        )`)

}