import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const query = `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status`;
  const result = await pool.query(query, [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  ]);
  return result;
};

const getAllVehicles = async () => {
  const query = `SELECT id,vehicle_name,type,registration_number,daily_rent_price,availability_status FROM vehicles`;
  const result = await pool.query(query);
  return result;
};

const getVehicleById = async (vehicleId: string | number) => {
  const query = `SELECT id,vehicle_name,type,registration_number,daily_rent_price,availability_status FROM vehicles WHERE id=$1`;
  const result = await pool.query(query, [vehicleId]);
  return result;
};

const updateVehicle = async (
  payload: Record<string, unknown>,
  vehicleId: string | number,
) => {
  const query = `UPDATE vehicles SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
      WHERE id = $6 
      RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status`;


  const result = await pool.query(query, [
    payload?.vehicle_name,
    payload?.type,
    payload?.registration_number,
    payload?.daily_rent_price,
    payload?.availability_status,
    vehicleId,
  ]);
  return result;
};

const deleteVehicle = async(vehicleId:string)=>{

   const bookingCheckQuery = `
      SELECT 1 
      FROM bookings 
      WHERE vehicle_id = $1 AND status = 'active'
      LIMIT 1
    `;
    const bookingResult = await pool.query(bookingCheckQuery, [vehicleId]);

    if (bookingResult.rows.length > 0) {
      throw new Error("Vehicle has active bookings and cannot be deleted");
    }

  const query =  `DELETE FROM vehicles WHERE id=$1`
  const result = await pool.query(query,[vehicleId]);
  return result;
}

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
