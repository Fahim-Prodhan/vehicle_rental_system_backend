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

  console.log(vehicle);

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
  }else if(loggedInUser.role == 'customer'){
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
    const result = await pool.query(query,[loggedInUser.id]);
    return result;
  }
};

export const bookingService = {
  createBooking,
  getAllBookings,
};
