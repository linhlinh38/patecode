import { Request, Response, NextFunction } from "express";

import { AuthRequest } from "./authentication";
import { memberService } from "../services/member.service";

export const Author = (isAdmin: boolean) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.loginUser;
    let user;
    try {
      user = await memberService.getById(id);
    } catch (error) {
      next(error);
    }

    if (!user) return res.status(401).json({ message: "Unauthorization" });

    if (user.isAdmin === isAdmin) next();
    else return res.status(401).json({ message: "Unauthorization" });
  };
};
