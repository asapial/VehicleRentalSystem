import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { auth } from "../../middleware/auth";
import { autoReturn } from "../../middleware/autoReturn";

const route=Router();


route.post("/",autoReturn,auth("admin"),vehicleController.createVehicle);

route.get("/",autoReturn,vehicleController.getAllVehicle);

route.get("/:id",autoReturn,vehicleController.getVehicleByID);

route.put("/:id",autoReturn,auth("admin"),vehicleController.updateVehicleByID);

route.delete("/:id",autoReturn,auth("admin"),vehicleController.deleteVehicleByID);




export  const vehicleRoute=route;