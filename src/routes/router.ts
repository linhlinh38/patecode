import express, { Request, Response, NextFunction } from "express";
import route from "./index.route";
const root = express.Router();
root.use("/", route);

export default root;
