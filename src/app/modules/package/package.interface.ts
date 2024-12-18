import { Model } from "mongoose";


export type IPackage = {
    title: String;
    price: Number;
    duration: String;
    feature: [String],
    priceId: String
}

export type PackageModel = Model<IPackage, Record<string, unknown>>;