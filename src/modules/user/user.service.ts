import { pool } from "../../config/db";

const getAllUsers = async()=>{
    const query =  `SELECT id,name, email,phone,role FROM users`;
    return await pool.query(query);
}


export const userServices = {
    getAllUsers,
}