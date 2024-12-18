import { model, Schema } from "mongoose";
import { IService, ServiceModel } from "./service.interface";


const serviceSchema = new Schema<IService, ServiceModel>(
    {
        title: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        image: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        discount: {
            type: Number,
            required: false
        },
        duration: {
            type: Number,
            required: false
        },
        description: {
            type: Number,
            required: false
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Children"],
            required: false
        },
        barber: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            default: 0
        },
        totalRating: {
            type: Number,
            default: 0
        }
        
    },
    {
        timestamps: true
    }
)

export const Service = model<IService, ServiceModel>("Service", serviceSchema)