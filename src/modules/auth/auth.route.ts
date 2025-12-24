import { Router } from "express";
import { authController } from "./auth.controller";
import { autoReturn } from "../../middleware/autoReturn";

const route= Router();


route.post("/signup",autoReturn,authController.signup);

route.post("/signin",autoReturn,authController.signIn);




export const authRoute=route;