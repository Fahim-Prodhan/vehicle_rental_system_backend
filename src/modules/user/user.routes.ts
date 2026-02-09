import { Router } from "express";
import { userControllers } from "./user.controller";
import authChecker from "../../middleware/authChecker";

const router = Router();

router.get('/',authChecker('admin'), userControllers.getAllUsers);

export const userRoutes = router;