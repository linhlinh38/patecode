import { Model } from "mongoose";

export interface ICRUDService<T> {
  model: Model<T>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  getAll(): Promise<T[] | null>;
  getById(id: string): Promise<T>;
  delete(id: string): Promise<void>;
}
