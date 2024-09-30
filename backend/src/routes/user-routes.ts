import { Router } from "express";
import { gettAllUsers, userLogin, userSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validator.js"
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/", gettAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);

export default userRoutes;