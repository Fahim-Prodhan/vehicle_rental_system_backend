import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const bookingStart = new Date(payload.rent_start_date as string);
  const bookingEnd = new Date(payload.rent_end_date as string);

  if (bookingEnd <= bookingStart) {
    throw new Error("End date must be greater than start date");
  }

  const durationInMs = bookingEnd.getTime() - bookingStart.getTime();

  const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

  const vehicle = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [payload.vehicle_id],
  );

  if (vehicle.rowCount == 0) {
    throw new Error("No vehicle available with this id");
  }
  if (vehicle.rows[0].availability_status != "available") {
    throw new Error("Vehicle is already booked");
  }

  await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
    "booked",
    payload.vehicle_id,
  ]);


  const dailyPrice = vehicle.rows[0].daily_rent_price;

  const totalPrice = durationInDays * dailyPrice;

  const query = `INSERT INTO bookings(customer_id,vehicle_id, rent_start_date, rent_end_date,total_price) VALUES($1,$2,$3,$4,$5) RETURNING id,customer_id,vehicle_id, rent_start_date, rent_end_date,total_price, status`;
  const result = await pool.query(query, [
    payload.customer_id,
    payload.vehicle_id,
    payload.rent_start_date,
    payload.rent_end_date,
    totalPrice,
  ]);

  return { booking: result.rows[0], vehicle: vehicle.rows[0] };
};

const getAllBookings = async (loggedInUser: JwtPayload) => {
  if (loggedInUser.role == "admin") {
    const query = `SELECT 
                    b.id,
                    b.customer_id,
                    b.vehicle_id,
                    b.rent_start_date,
                    b.rent_end_date,
                    b.total_price,
                    b.status,

                    u.name AS customer_name,
                    u.email AS customer_email,

                    v.vehicle_name,
                    v.registration_number

                    FROM bookings b
                    JOIN users u ON b.customer_id = u.id
                    JOIN vehicles v ON b.vehicle_id = v.id
                    ORDER BY b.id;
  `;
    const result = await pool.query(query);
    return result;
  } else if (loggedInUser.role == "customer") {
    const query = `SELECT 
                    b.id,
                    b.customer_id,
                    b.vehicle_id,
                    b.rent_start_date,
                    b.rent_end_date,
                    b.total_price,
                    b.status,

                    v.vehicle_name,
                    v.registration_number,
                    v.type

                    FROM bookings b 
                    JOIN vehicles v ON b.vehicle_id = v.id
                    WHERE customer_id=$1
                    ORDER BY b.id;
  `;
    const result = await pool.query(query, [loggedInUser.id]);
    return result;
  }
};

const updateBooking = async (
  payload: Record<string, unknown>,
  loggedInUser: JwtPayload,
  bookingId: string,
) => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId],
  );

  if (bookingResult.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  if (loggedInUser.role === "admin" && payload.status === "returned") {
    const updatedBooking = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status`,
      [payload.status, bookingId],
    );
    const vehicleId = updatedBooking.rows[0].vehicle_id;
    const updatedVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`, [
      "available",
      vehicleId
    ]);

    const result = {...updatedBooking.rows[0], vehicle:updatedVehicle.rows[0]}

    return result;
  }

  if (loggedInUser.role === "customer" && payload.status === "cancelled") {
    // Ownership check
    if (booking.customer_id !== loggedInUser.id) {
      throw new Error("Unauthorized action");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("Cannot cancel after booking has started");
    }

    const updatedBooking = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status`, [payload.status, bookingId],
    );

    return updatedBooking.rows[0];
  }

  throw new Error("Invalid status update");
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking
};
