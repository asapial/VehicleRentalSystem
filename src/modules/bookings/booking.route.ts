import { Router } from "express";
import { auth } from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";
import { autoReturn } from "../../middleware/autoReturn";


const route = Router();


route.post("/",autoReturn, auth("admin", "customer"), bookingControllers.createBooking);

route.get("/",autoReturn, auth("admin", "customer"), bookingControllers.getAllBookings);

route.put("/:id", autoReturn, auth("admin", "customer"), bookingControllers.updateBookings);

// route.post("/admin/auto-return",auth("admin"),bookingControllers.runAutoReturnManually);


export const bookingRoute = route;