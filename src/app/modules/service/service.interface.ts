import { Model, Types } from "mongoose";


export type IService = {
    title: Types.ObjectId;
    category: Types.ObjectId;
    image: String;
    price: Number;
    discount?: Number;
    duration: String;
    description: String;
    gender: "Male" | "Female" | "Children" | "Others";
    barber: Types.ObjectId;
    isOffered: Boolean;
    rating: Number;
    status: "Active" | "Inactive";
    totalRating: Number;
}

export type ServiceModel = Model<IService, Record<string, unknown>>;