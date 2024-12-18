import { Model, Types } from "mongoose";

export type IReservation = {
    user: Types.ObjectId;
    professional: Types.ObjectId;
    service: Types.ObjectId;
    status: 'Complete' | "Pending" | "Accept" | "Reject" | "Cancel",
    schedule: {
        date: String;
        time: String;
    }
}

export type ReservationModel = Model<IReservation, Record<string, unknown>>