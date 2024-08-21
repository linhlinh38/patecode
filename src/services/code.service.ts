import { ICodes } from "../interfaces/code.interface";
import codeModel from "../models/code.model";
import { BaseService } from "./base.service";

class CodeService extends BaseService<ICodes> {
  constructor() {
    super(codeModel);
  }
}
export const codeService = new CodeService();
