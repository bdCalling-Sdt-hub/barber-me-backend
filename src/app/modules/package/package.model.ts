import { model, Schema } from "mongoose";
import { IPackage, PackageModel } from "./package.interface";


const packageSchema = new Schema<IPackage, PackageModel>(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        priceId: {
            type: String,
            required: true
        },
        feature: [
            {
                type: String,
                required: true
            }
        ]
        
    },
    {
        timestamps: true
    }
)

export const Package = model<IPackage, PackageModel>("Package", packageSchema)