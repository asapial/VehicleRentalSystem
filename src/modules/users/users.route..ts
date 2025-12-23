import { Router } from "express";
import { auth } from "../../middleware/auth";
import { usersControllers } from "./users.controller";

const route=Router();


route.get("/",auth("admin"),usersControllers.getAllUsers);

route.put("/:id",auth("admin","customer"),usersControllers.updateUserById);

route.delete("/:id",auth("admin"),usersControllers.deleteUserById);




export  const usersRoute=route;