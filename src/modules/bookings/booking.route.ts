import { Router } from "express";
import { auth } from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";


const route=Router();


route.post("/",auth("admin","customer"),bookingControllers.createBooking);

route.get("/",auth("admin","customer"),bookingControllers.getAllBookings);

route.put("/:id",auth("admin","customer"),bookingControllers.updateBookings);

export  const bookingRoute=route;