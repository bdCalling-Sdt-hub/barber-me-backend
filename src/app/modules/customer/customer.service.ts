import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { Reservation } from "../reservation/reservation.model";

const customerProfileFromDB = async (user: JwtPayload): Promise<{ totalServiceCount: number, totalSpend: number   }> => {

    const customer = await User.findById(user.id).select("name email contact profile address gender dateOfBirth").lean();
    if (!customer) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Customer Profile not found");
    }

    const totalServiceCount = await Reservation.countDocuments({ customer: user.id, status: "Completed", paymentStatus: "Paid" });

    const totalSpend = await Reservation.aggregate([
        {
            $match: {
                customer: user.id,
                status: "Completed",
                paymentStatus: "Paid"
            }
        },
        {
            $group: {
                _id: null,
                totalSpend: { $sum: "$price" }
            }
        }
    ]);

    return {
        ...customer,
        totalServiceCount,
        totalSpend: totalSpend[0]?.totalSpend || 0
    };
}


export const CustomerService = {
    customerProfileFromDB
}