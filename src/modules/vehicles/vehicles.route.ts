import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { auth } from "../../middleware/auth";

const route=Router();


route.post("/",vehicleController.createVehicle);

route.get("/",auth(),vehicleController.getAllVehicle);

route.get("/:id",vehicleController.getVehicleByID);



export  const vehicleRoute=route;