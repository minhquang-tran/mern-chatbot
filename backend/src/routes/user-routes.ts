import { Router } from "express";
import { gettAllUsers } from "../controllers/user-controllers.js";

const userRoutes = Router();

userRoutes.get("/", gettAllUsers);

export default userRoutes;