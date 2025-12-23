import express from "express";

import { bookingServices } from "./booking.services";



const createBooking = async (req: express.Request, res: express.Response) => {

    const tokenUser: any = req.user;
    const reqUser = req.body;



    if (tokenUser.role === "customer" && tokenUser.id !== reqUser.customer_id) {
        return res.status(403).json({
            success: true,
            message: "User can only create booking for their own"
        })
    }

    const startDate = new Date(reqUser.rent_start_date);
    const endDate = new Date(reqUser.rent_end_date);

    if (endDate <= startDate) {
        return res.status(400).json({
            success: false,
            message: "Rent end date must be after rent start date"
        });
    }


    try {
        const result = await bookingServices.createBookingQuery(req);
        res.status(201).json({
            success: true,
            message: "Vehicle  created successfully",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getAllBookings = async (req: express.Request, res: express.Response) => {
   
    const tokenUser: any = req.user;
   
    try {

        if (!tokenUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        let result;

        if (tokenUser.role === "admin") {
            result = await bookingServices.getAllBookingsForAdminQuery();
        } 
        else if (tokenUser.role === "customer") {
            result = await bookingServices.getAllBookingsForCustomerQuery(tokenUser.id);
        } 
        else {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            message:
                tokenUser.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

const updateBookings = async (req: express.Request, res: express.Response) => {
   
    const tokenUser: any = req.user;
   
    try {

        if (!tokenUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        let result;

        if (tokenUser.role === "admin") {
            result = await bookingServices.updateBookingsForAdminQuery(req);
        } 
        else if (tokenUser.role === "customer") {
            result = await bookingServices.updateBookingsForCustomerQuery(req);
        } 
        else {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            message:
                tokenUser.role === "admin"
                    ? "Booking marked as returned. Vehicle is now available"
                    : "Booking cancelled successfully",
            data: result
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};





export const bookingControllers = {
    createBooking,
    getAllBookings,
    updateBookings
}