import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { auth } from "../../middleware/auth";

const route=Router();


route.post("/",auth("admin"),vehicleController.createVehicle);

route.get("/",vehicleController.getAllVehicle);

route.get("/:id",vehicleController.getVehicleByID);

route.put("/:id",auth("admin"),vehicleController.updateVehicleByID);




export  const vehicleRoute=route;