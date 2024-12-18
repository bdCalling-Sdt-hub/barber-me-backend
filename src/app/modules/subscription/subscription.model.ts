import { model, Schema } from "mongoose";
import { ISubscription, SubscriptionModel } from "./subscription.interface";

const subscriptionModel = new Schema<ISubscription, SubscriptionModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "Cancel", "Deactivate", "Expired"],
            default: "Active",
            required: true
        },
        subscriptionId: {
            type: String,
            required: true
        },
        priceId: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Subscription = model<ISubscription, SubscriptionModel>("Subscription", subscriptionModel)