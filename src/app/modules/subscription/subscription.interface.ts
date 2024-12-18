import { Model, Types } from "mongoose";

export type ISubscription = {
    user: Types.ObjectId;
    status: 'Active' | 'Deactivate' | "Expired" | "Cancel";
    subscriptionId: String;
    priceId: String;
    price: Number;
    startDate: String;
    endDate: String;
}

export type SubscriptionModel = Model<ISubscription, Record<string, unknown>>