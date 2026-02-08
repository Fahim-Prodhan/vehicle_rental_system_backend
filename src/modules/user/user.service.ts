import { pool } from "../../config/db";

const signup = async(payload: Record<string,unknown>)=> {
    const {name, email, password, phone, role} = payload;
    const query =  `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING *`
    const result = await pool.query(query,[name, email, password, phone, role]);
    return result;  
}

export const userService = {
    signup,
}