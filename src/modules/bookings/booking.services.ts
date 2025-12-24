import { error } from "node:console";
import { pool } from "../../config/db";
import express from "express";
import { vehicleRoute } from "../vehicles/vehicles.route";



const createBookingQuery = async (req: express.Request) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

    //  Get vehicle info
    const vehicleRes = await pool.query(
        `SELECT vehicle_name, daily_rent_price, availability_status 
         FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );

    if (vehicleRes.rowCount === 0) {
        throw new Error("Vehicle not found");
    }

    if (vehicleRes.rows[0].availability_status !== "available") {
        throw new Error("Vehicle is not available");
    }

    //  Calculate rent duration
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    const rentDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (rentDays <= 0) {
        throw new Error("Invalid rent date range");
    }

    const total_price = rentDays * vehicleRes.rows[0].daily_rent_price;

    //  Insert booking (CORRECT TABLE)
    const bookingRes = await pool.query(
        `
        INSERT INTO bookings
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *
        `,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    //  Update vehicle availability
    await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'booked'
        WHERE id = $1
        `,
        [vehicle_id]
    );

    const booking = bookingRes.rows[0];


    return {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
            vehicle_name: vehicleRes.rows[0].vehicle_name,
            daily_rent_price: vehicleRes.rows[0].daily_rent_price
        }
    };
};

const getAllBookingsForAdminQuery = async () => {


    //  Get vehicle info
    const vehicleRes = await pool.query(
        `
  SELECT b.*, v.vehicle_name, v.registration_number, u.name AS customer_name, u.email
  FROM bookings b
  INNER JOIN vehicles v ON b.vehicle_id = v.id
  INNER JOIN users u ON b.customer_id = u.id
  `
    );

    console.log(vehicleRes.rows)

    const returnedData: any = [];

    vehicleRes.rows.map((bookingInformation) => {
        returnedData.push({
            id: bookingInformation.id,
            customer_id: bookingInformation.customer_id,
            vehicle_id: bookingInformation.vehicle_id,
            rent_start_date: bookingInformation.rent_start_date.toISOString().split("T")[0],
            rent_end_date: bookingInformation.rent_end_date.toISOString().split("T")[0],
            total_price: bookingInformation.total_price,
            status: bookingInformation.status,
            customer: {
                name: bookingInformation.customer_name,
                email: bookingInformation.email
            },
            vehicle: {
                vehicle_name: bookingInformation.vehicle_name,
                registration_number: bookingInformation.registration_number
            }

        })
    })

    console.log("Returneed Data: ", returnedData);

    return returnedData;
};

const getAllBookingsForCustomerQuery = async (customer_id: string) => {


    //  Get vehicle info
    const vehicleRes = await pool.query(
        `
  SELECT b.*, v.vehicle_name, v.registration_number,v.type, u.name AS customer_name, u.email
  FROM bookings b
  INNER JOIN vehicles v ON b.vehicle_id = v.id
  INNER JOIN users u ON b.customer_id = u.id
  `
    );

    const returnedData: any = [];

    vehicleRes.rows.map((bookingInformation) => {

        if (customer_id === bookingInformation.customer_id) {
            returnedData.push({
                id: bookingInformation.id,
                customer_id: bookingInformation.customer_id,
                vehicle_id: bookingInformation.vehicle_id,
                rent_start_date: bookingInformation.rent_start_date.toISOString().split("T")[0],
                rent_end_date: bookingInformation.rent_end_date.toISOString().split("T")[0],
                total_price: bookingInformation.total_price,
                status: bookingInformation.status,

                vehicle: {
                    vehicle_name: bookingInformation.vehicle_name,
                    registration_number: bookingInformation.registration_number,
                    type: bookingInformation.type
                }

            })
        }
    })


    return returnedData;
};


const updateBookingsForAdminQuery = async (req: express.Request) => {

    const id: any = req.params.id
    await pool.query(
        `
        UPDATE bookings
        SET status = 'returned'
        WHERE id = $1
        `,
        [id]
    );

    const result = await pool.query(

        `
        SELECT * FROM bookings WHERE id = $1
        `, [id]
    )

    await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        `,
        [result.rows[0].vehicle_id]
    );

    const vehicleRes = await pool.query(
        `
SELECT * FROM vehicles WHERE id = $1
        `,
        [result.rows[0].vehicle_id]
    );

    const { created_at, ...filteredData } = result.rows[0];


    const returnedData = {
        ...filteredData,
        vehicle: {
            availability_status: vehicleRes.rows[0].availability_status
        }
    }

    return returnedData;

}

const updateBookingsForCustomerQuery = async (req: express.Request) => {

    const id: any = req.params.id
    await pool.query(
        `
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = $1
        `,
        [id]
    );

    const result = await pool.query(

        `
        SELECT * FROM bookings WHERE id = $1
        `, [id]
    )

    await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        `,
        [result.rows[0].vehicle_id]
    );

    const vehicleRes = await pool.query(
        `
SELECT * FROM vehicles WHERE id = $1
        `,
        [result.rows[0].vehicle_id]
    );



    return result.rows[0];

}




export const bookingServices = {
    createBookingQuery,
    getAllBookingsForAdminQuery,
    getAllBookingsForCustomerQuery,
    updateBookingsForAdminQuery,
    updateBookingsForCustomerQuery
}