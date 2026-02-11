import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    const finalResult = { ...result.booking, vehicle: result.vehicle };
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: finalResult,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getAllBookings(req.user as JwtPayload);
    if (result?.rowCount == 0) {
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result.rows,
      });
    } else if (result?.rows[0].customer_name) {
      const formattedData = result.rows.map((item: any) => ({
        id: item.id,
        customer_id: item.customer_id,
        vehicle_id: item.vehicle_id,
        rent_start_date: new Date(item.rent_start_date).toLocaleDateString(
          "en-CA",
          { timeZone: "Asia/Dhaka" },
        ),
        rent_end_date: new Date(item.rent_end_date).toLocaleDateString(
          "en-CA",
          { timeZone: "Asia/Dhaka" },
        ),
        total_price: item.total_price,
        status: item.status,
        customer: {
          name: item.customer_name,
          email: item.customer_email,
        },
        vehicle: {
          vehicle_name: item.vehicle_name,
          registration_number: item.registration_number,
        },
      }));

      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: formattedData,
      });
    } else {
      const formattedData = result?.rows.map((item: any) => ({
        id: item.id,
        customer_id: item.customer_id,
        vehicle_id: item.vehicle_id,
        rent_start_date: new Date(item.rent_start_date).toLocaleDateString(
          "en-CA",
          { timeZone: "Asia/Dhaka" },
        ),
        rent_end_date: new Date(item.rent_end_date).toLocaleDateString(
          "en-CA",
          { timeZone: "Asia/Dhaka" },
        ),
        total_price: item.total_price,
        status: item.status,
        vehicle: {
          vehicle_name: item.vehicle_name,
          registration_number: item.registration_number,
          type: item.type,
        },
      }));

      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: formattedData,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.updateBooking(req.body, req.user as JwtPayload, req.params.bookingId as string);
    res.status(200).json({
        success:true,
        message:"Booking marked as returned. Vehicle is now available",
        data:result
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking
};
