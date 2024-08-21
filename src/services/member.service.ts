import { IMembers } from "../interfaces/members.interface";
import memberModel from "../models/members.model";
import tokenModel from "../models/tokens.model";
import { encryptedPassword } from "../utils/jwt";
import { sendEmail } from "../utils/sendMail";
import { BaseService } from "./base.service";
import bcrypt from "bcrypt";
const crypto = require("crypto");

class MemberService extends BaseService<IMembers> {
  constructor() {
    super(memberModel);
  }

  requestPasswordReset = async (email) => {
    const member = await memberService.search({ email });

    if (!member) throw new Error("member does not exist");
    let token = await tokenModel.findOne({ memberId: member[0]._id });
    if (token) await token.deleteOne();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await encryptedPassword(resetToken);

    await new tokenModel({
      memberId: member[0]._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `passwordReset?token=${resetToken}&id=${member[0]._id}`;
    await sendEmail(
      member[0].email,
      "Password Reset Request",
      { name: member[0].name, link: link },
      "../utils/template/requestResetPassword.handlebars"
    );
    return link;
  };

  resetPassword = async (memberId, token, password) => {
    const passwordResetToken = await tokenModel.findOne({ memberId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await encryptedPassword(password);
    await memberModel.updateOne(
      { _id: memberId },
      { $set: { password: hash } },
      { new: true }
    );
    const member = await memberModel.findById({ _id: memberId });
    sendEmail(
      member.email,
      "Password Reset Successfully",
      {
        name: member.name,
      },
      "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return true;
  };
}

export const memberService = new MemberService();
