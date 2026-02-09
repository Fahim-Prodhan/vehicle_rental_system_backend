import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import authChecker from "../../middleware/authChecker";

const router = Router();

router.post('/',authChecker('admin'),vehicleControllers.createVehicle);
router.get('/',vehicleControllers.getAllVehicles)
router.get('/:vehicleId',vehicleControllers.getVehicleById)
router.put('/:vehicleId',vehicleControllers.updateVehicle)

export const vehicleRoutes = router;