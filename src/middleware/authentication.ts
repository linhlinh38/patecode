import { NextFunction, Request, Response } from "express";
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/envConfig";

export interface AuthRequest extends express.Request {
  loginUser?: string;
}

function isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
  return typeof decoded !== "string";
}

const { SECRET_KEY_FOR_ACCESS_TOKEN } = config;

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthentication" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY_FOR_ACCESS_TOKEN);

    if (isJwtPayload(decoded)) {
      req.loginUser = decoded.member;
      next();
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthentication" });
  }
};

export default verifyToken;
