import { Request, Response } from "express";
import { userService } from "./user.service";

const signup = async(req:Request, res:Response)=>{
    try {
        const result = await userService.signup(req.body);
        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result.rows[0]
        })
    } catch (error:any) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const signin = async(req:Request, res:Response)=>{
    try {
        const result = await userService.signup(req.body);
        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result.rows[0]
        })
    } catch (error:any) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const userController = {
    signup,
    signin
}