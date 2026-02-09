import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import config from "../config";

const authChecker = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      const authToken = bearerToken?.split(" ")[1];

      if (!authToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(
        authToken,
        config.secret_key as string
      ) as JwtPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  };
};


export default authChecker;