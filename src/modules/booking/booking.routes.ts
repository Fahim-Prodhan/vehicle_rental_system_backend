import { Router } from "express";
import { bookingController } from "./booking.controller";
import authChecker from "../../middleware/authChecker";

const router = Router();

router.post('/',authChecker('admin', 'customer'), bookingController.createBooking)

export const bookingRoutes = router;