import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    const finalResult = {...result.booking, vehicle:result.vehicle}
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data:finalResult,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
    createBooking
}
