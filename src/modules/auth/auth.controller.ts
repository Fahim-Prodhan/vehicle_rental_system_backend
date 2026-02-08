import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (password.length < 6) {
      return res.status(400).json( {
        success: false,
        message: "Password must be at least 6 characters",
      })
    }

    const result = await authService.signup(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.signin(email, password);
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.jwtToken,
        user: result.user,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  signup,
  signin,
};
