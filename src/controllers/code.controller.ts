import { NextFunction, Request, Response } from "express";
import { ICodes } from "../interfaces/code.interface";
import { codeService } from "../services/code.service";
import { encryptedPassword } from "../utils/jwt";
import { AuthRequest } from "../middleware/authentication";
async function createCode(req: Request, res: Response, next: NextFunction) {
  const newCode: ICodes = {
    title: req.body.title,
    description: req.body.description,
    language: req.body.language,
    code: req.body.code,
    isUsepassword: req.body.isUsepassword,
    password: req.body.password,
    member: req.body.member,
  };
  try {
    newCode.password = await encryptedPassword(req.body.password);
    await codeService.create(newCode);
    return res.status(201).json({ message: "Created Code Successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAllCodeOfMember(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const code = await codeService.search({ member: req.loginUser });
    return res.status(200).json({ code: code });
  } catch (error) {
    next(error);
  }
}

async function getCodeById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const code = await codeService.getById(req.params.id);
    return res.status(200).json({ code: code });
  } catch (error) {
    next(error);
  }
}

export const codeController = {
  createCode,
  getAllCodeOfMember,
  getCodeById,
};
