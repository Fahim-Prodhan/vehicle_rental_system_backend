import { Router } from "express";
import { bookingController } from "./booking.controller";
import authChecker from "../../middleware/authChecker";

const router = Router();

router.post('/',authChecker('admin', 'customer'), bookingController.createBooking)
router.get('/',authChecker('admin', 'customer'), bookingController.getAllBookings)
router.put('/:bookingId',authChecker('admin', 'customer'), bookingController.updateBooking)

export const bookingRoutes = router;