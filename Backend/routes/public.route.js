import express from "express";
import { signup, login } from "../controllers/public.controller";

const publicRoutes = express.Router();

publicRoutes.post("/signup", signup);
publicRoutes.post("/login", login);

export default publicRoutes;
