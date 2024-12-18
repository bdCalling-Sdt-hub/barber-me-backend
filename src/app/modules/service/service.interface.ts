import { Model, Types } from "mongoose";


export type IService = {
    title: String;
    price: Number;
    professional: Types.ObjectId;
    discount?: Number;
    gender: "Male" | "Female";
    category: String;
}

export type ServiceModel = Model<IService, Record<string, unknown>>;