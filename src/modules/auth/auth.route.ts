import { Router } from "express";
import { authController } from "./auth.controller";

const route= Router();


route.post("/signup",authController.signup);

route.post("/signin",authController.signIn);




export const authRoute=route;