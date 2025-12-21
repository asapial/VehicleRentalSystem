import { Router } from "express";
import { authController } from "./auth.controller";

const route= Router();


route.post("/signup",authController.signup);




export const authRoute=route;