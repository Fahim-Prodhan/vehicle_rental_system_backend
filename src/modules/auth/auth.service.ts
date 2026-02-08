import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;


  const hasPassword = await bcrypt.hash(password as string, 10);
  const query = `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`;
  const result = await pool.query(query, [
    name,
    email,
    hasPassword,
    phone,
    role,
  ]);
  return result;
};

const signin = async (email: string, password: string) => {
  const query = `SELECT * FROM users WHERE email=$1`;
  const result = await pool.query(query, [email]);
  if (result.rows.length == 0) {
    return { success: false, message: "User not found" };
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return { success: false, message: "Incorrect Password" };
  }

  const jwtToken = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.secret_key as string,
    {
      expiresIn: "7d",
    },
  );

  return {
    success: true,
    jwtToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const authService = {
  signup,
  signin,
};
