import { Router } from "express";
import { gettAllUsers, userLogin, userSignup } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validator.js"

const userRoutes = Router();

userRoutes.get("/", gettAllUsers);
userRoutes.post("/signup", validate(signupValidator),  userSignup);
userRoutes.post("/login", validate(loginValidator),  userLogin);

export default userRoutes;