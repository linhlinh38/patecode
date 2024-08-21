import { NextFunction, Request, Response } from "express";
import { IMembers } from "../interfaces/members.interface";
import { memberService } from "../services/member.service";
import { encryptedPassword } from "../utils/jwt";
import memberModel from "../models/members.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/envConfig";
import { AuthRequest } from "../middleware/authentication";
import { log } from "console";
import tokenModel from "../models/tokens.model";
const crypto = require("crypto");
const { SECRET_KEY_FOR_ACCESS_TOKEN, SECRET_KEY_FOR_REFRESH_TOKEN } = config;

async function createMember(req: Request, res: Response, next: NextFunction) {
  const newMember: IMembers = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    yob: req.body.yob,
  };
  try {
    const key: Partial<IMembers> = {
      email: req.body.email,
    };
    const member = await memberService.search(key);

    if (member.length !== 0) {
      return res.status(400).json({ message: "Email already exist" });
    }
    newMember.password = await encryptedPassword(req.body.password);
    await memberService.create(newMember);
    return res.status(201).json({ message: "Created Member Successfully" });
  } catch (error) {
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const member = await memberModel.findOne({ email });
    if (!member) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = { member: member._id.toString() };

    const token = jwt.sign(payload, SECRET_KEY_FOR_ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
}

async function getMemberInfo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const member = await memberService.getById(req.loginUser);
    return res.status(200).json({ member: member });
  } catch (error) {
    next(error);
  }
}

async function changePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  try {
    const member = await memberModel.findOne({ _id: req.loginUser });
    if (!member) {
      return res.status(401).json({ message: "Unauthentication" });
    }

    const isMatch = await bcrypt.compare(oldPassword, member.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password entered incorrect",
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Confirmed Password: Password not match",
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: "Password not changed",
      });
    }

    member.password = await encryptedPassword(req.body.newPassword);
    await memberService.update(req.loginUser, member);
    return res.status(200).json({
      message: "Change Password Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errorMessage: "Change Password Failed",
    });
  }
}

async function getAllMember(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const members = await memberService.getAll();
    return res.status(200).json({ memberList: members });
  } catch (error) {
    next(error);
  }
}

async function updateMember(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const updateMember: Partial<IMembers> = req.body;
  try {
    if (updateMember.email) {
      const oldData = await memberService.getById(req.loginUser);
      const key = {
        email: updateMember.email,
        _id: { $ne: oldData._id },
      };
      const member = await memberModel.find(key);

      if (member.length !== 0) {
        return res.status(400).json({ message: "email already exist" });
      }
    }

    await memberService.update(req.loginUser, updateMember);
    return res.status(201).json({ message: "Update Member Successfully" });
  } catch (error) {
    next(error);
  }
}

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await memberService.requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

async function resetPassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { newPassword, confirmNewPassword, token, memberId } = req.body;
  try {
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Confirmed Password: Password not match",
      });
    }
    const result = await memberService.resetPassword(
      memberId,
      token,
      newPassword
    );
    if (result) {
      return res.status(200).json({
        message: "Reset Password Successfully",
      });
    } else {
      return res.status(500).json({
        message: "Reset Password Failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errorMessage: "Reset Password Failed",
    });
  }
}

export const memberController = {
  createMember,
  login,
  getMemberInfo,
  updateMember,
  getAllMember,
  changePassword,
  resetPasswordRequestController,
  resetPassword,
};
