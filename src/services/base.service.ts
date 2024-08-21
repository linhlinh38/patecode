import { Model, IfAny, Document, Require_id } from "mongoose";
import { ICRUDService } from "../utils/ICRUDService";

export abstract class BaseService<T> implements ICRUDService<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: T): Promise<T> {
    const newData = new this.model(data);
    try {
      await newData.save();
      return newData;
    } catch (error) {
      throw new Error(error);
    }
  }
  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const record = await this.model.findById(id);
      if (!record) {
        throw new Error("Cannot fine update data");
      }
      Object.assign(record, data);
      await record.save();

      return record;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAll(): Promise<T[]> {
    try {
      return await this.model.find();
    } catch (error) {
      throw new Error(error);
    }
  }
  async search(key?: Partial<T>): Promise<T[] | null> {
    return await this.model.find(key);
  }
  async getById(id: string): Promise<T> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(error);
    }
  }
  async delete(id: string): Promise<void> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
