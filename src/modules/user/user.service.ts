import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const signup = async(payload: Record<string,unknown>)=> {
    const {name, email, password, phone, role} = payload;
    const hasPassword = await bcrypt.hash(password as string, 10)
    const query =  `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`
    const result = await pool.query(query,[name, email, hasPassword, phone, role]);
    return result;  
}

const signin = async(email:string, password:string)=> {

    const query =  `SELECT * FROM users WHERE email=$1`
    const user = await pool.query(query,[email]);
    if(!user){
        return [{success:false, message:"user not found"}];
    }
    
}

export const userService = {
    signup,
    signin,
}