import express from "express";
import {UserRegister, UserLogin } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/signup', UserRegister);
router.post('/signin', UserLogin)


export default router