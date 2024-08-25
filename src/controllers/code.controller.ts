import { NextFunction, Request, Response } from "express";
import { ICodes } from "../interfaces/code.interface";
import { codeService } from "../services/code.service";
import { encryptedPassword } from "../utils/jwt";
import { AuthRequest } from "../middleware/authentication";
import bcrypt from "bcrypt";

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
    const code = await codeService.create(newCode);
    return res.status(201).json({
      message: "Created Code Successfully",
      link: `http://localhost:3000/snippet/${code._id}`,
    });
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

async function getCodeById(req: Request, res: Response, next: NextFunction) {
  try {
    const code = await codeService.getById(req.params.id);
    if (code.isUsepassword) {
      return res.status(200).json({ requiredPass: true, code: null });
    } else {
      return res.status(200).json({ requiredPass: false, code: code });
    }
  } catch (error) {
    next(error);
  }
}

async function validatePasswordGetCode(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, password } = req.body;
    const code = await codeService.getById(id);
    if (!code) {
      return res.status(404).json({ message: "Code not found!" });
    }
    const isMatch = await bcrypt.compare(password, code.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    } else {
      return res.status(200).json({ code: code });
    }
  } catch (error) {
    next(error);
  }
}

export const codeController = {
  createCode,
  getAllCodeOfMember,
  getCodeById,
  validatePasswordGetCode,
};
