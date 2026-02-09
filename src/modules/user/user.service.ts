import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const getAllUsers = async () => {
    const query = `SELECT id,name, email,phone,role FROM users`;
    return await pool.query(query);
};

const updateUser = async (
    userId: string,
    loggedInUser:JwtPayload | undefined,
    payload: Record<string, unknown>,
) => {
    
    if (loggedInUser?.role == "customer" && loggedInUser?.id != userId) {
        throw new Error("You can update only your own profile");
    }
    if (loggedInUser?.role == "customer" && payload.role) {
        throw new Error("You have no access to change the role");
    }

    const query = `UPDATE users SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                phone = COALESCE($3, phone),
                role = COALESCE($4, role)
                WHERE id=$5 RETURNING id, name, email, phone, role`;

    const result = await pool.query(query,[payload?.name, payload?.email, payload?.phone, payload?.role, userId])
    return result;
};

export const userServices = {
    getAllUsers,
    updateUser,
};
