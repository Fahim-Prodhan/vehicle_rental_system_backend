import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    if (result.rows.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicleById(
      req.params.vehicleId as string | number,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    // const {
    //   vehicle_name,
    //   type,
    //   registration_number,
    //   daily_rent_price,
    //   availability_status,
    // } = req.body;
    const result = await vehicleServices.updateVehicle(
      //   vehicle_name,
      //   type,
      //   registration_number,
      //   daily_rent_price,
      //   availability_status,
      req.body,
      vehicleId as string | number,
    );

    if (result.rows.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await vehicleServices.deleteVehicle(
      req.params.vehicleId as string,
    );
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
