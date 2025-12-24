import { Router } from "express";
import { auth } from "../../middleware/auth";
import { usersControllers } from "./users.controller";
import { autoReturn } from "../../middleware/autoReturn";

const route=Router();


route.get("/",autoReturn,auth("admin"),usersControllers.getAllUsers);

route.put("/:id",autoReturn,auth("admin","customer"),usersControllers.updateUserById);

route.delete("/:id",autoReturn,auth("admin"),usersControllers.deleteUserById);




export  const usersRoute=route;