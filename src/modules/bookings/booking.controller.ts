import express from "express";

import { bookingServices } from "./booking.services";
import { autoReturnBookings } from "../../services/autoReturn.service";



const createBooking = async (req: express.Request, res: express.Response) => {
    const tokenUser: any = req.user;
    const reqUser = req.body;

    // 403 – Forbidden: customer can only create their own booking
    if (tokenUser.role === "customer" && tokenUser.id !== reqUser.customer_id) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
            errors: "Users can only create bookings for themselves"
        });
    }

    // 400 – Bad Request: invalid date range
    const startDate = new Date(reqUser.rent_start_date);
    const endDate = new Date(reqUser.rent_end_date);

    if (endDate <= startDate) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: "Rent end date must be after rent start date"
        });
    }

    try {
        const result = await bookingServices.createBookingQuery(req);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }
};

const getAllBookings = async (req: express.Request, res: express.Response) => {
    const tokenUser: any = req.user;

    try {
        // 401 – Unauthorized: missing or invalid token
        if (!tokenUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
                errors: "Missing or invalid authentication token"
            });
        }

        let result;

        if (tokenUser.role === "admin") {
            result = await bookingServices.getAllBookingsForAdminQuery();
        } else if (tokenUser.role === "customer") {
            result = await bookingServices.getAllBookingsForCustomerQuery(tokenUser.id);
        } else {
            // 403 – Forbidden: role not allowed
            return res.status(403).json({
                success: false,
                message: "Access denied",
                errors: "Your role does not have permission to view bookings"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                tokenUser.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result || []
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }
};


const updateBookings = async (req: express.Request, res: express.Response) => {
    const tokenUser: any = req.user;

    try {
        // 401 – Unauthorized: missing or invalid token
        if (!tokenUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
                errors: "Missing or invalid authentication token"
            });
        }

        let result;

        if (tokenUser.role === "admin") {
            result = await bookingServices.updateBookingsForAdminQuery(req);
        } else if (tokenUser.role === "customer") {
            result = await bookingServices.updateBookingsForCustomerQuery(req);
        } else {
            // 403 – Forbidden: role not allowed
            return res.status(403).json({
                success: false,
                message: "Access denied",
                errors: "Your role does not have permission to update bookings"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                tokenUser.role === "admin"
                    ? "Booking marked as returned. Vehicle is now available"
                    : "Booking cancelled successfully",
            data: result || []
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }
};


const runAutoReturnManually = async (req: express.Request, res: express.Response) => {
    try {
        await autoReturnBookings();

        res.status(200).json({
            success: true,
            message: "Auto-return executed successfully"
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};






export const bookingControllers = {
    createBooking,
    getAllBookings,
    updateBookings,
    runAutoReturnManually
}