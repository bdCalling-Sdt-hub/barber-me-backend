import { model, Schema } from "mongoose";
import { IService, ServiceModel } from "./service.interface";


const serviceSchema = new Schema<IService, ServiceModel>(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: false
        },
        professional: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Service = model<IService, ServiceModel>("Service", serviceSchema)