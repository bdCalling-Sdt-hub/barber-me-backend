import { model, Schema } from "mongoose";
import { IReservation, ReservationModel} from "./reservation.interface";


const reservationSchema = new Schema<IReservation, ReservationModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        professional: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Reject", "Accept", "Reject", "Complete"],
            default: "Pending",
            required: true
        },
        schedule: {
            date: {
                type: String,
                required: true
            },
            time: {
                type: String,
                required: true
            },
        }
    },
    {
        timestamps: true
    }
)

export const Reservation = model<IReservation, ReservationModel>("Reservation", reservationSchema)