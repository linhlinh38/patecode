import { codeController } from "../controllers/code.controller";
import { memberController } from "../controllers/members.controller";
import authentication from "../middleware/authentication";
import { Author } from "../middleware/authorization";
import express, { Request, Response, NextFunction } from "express";

const route = express.Router();

route.route("/login").post(memberController.login);
//route.route("/logout").get(memberController.logout);
route.get("/member", memberController.getAllMember);
route.get("/member/info", authentication, memberController.getMemberInfo);
route.post("/member/create", memberController.createMember);
route.post(
  "/member/requestResetPassword",
  memberController.resetPasswordRequestController
);
route.post("/member/resetPassword", memberController.resetPassword);
route.put("/member/update", authentication, memberController.updateMember);
route
  .route("/members/changePassword")
  .post(authentication, memberController.changePassword);

route.post("/code/create", codeController.createCode);
route.get("/code/me", authentication, codeController.getAllCodeOfMember);
route.get("/code/get/:id", codeController.getCodeById);
export default route;
