import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Portfolio } from "../portfolio/portfolio.model";
import { Review } from "../review/review.model"; 
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { Reservation } from "../reservation/reservation.model";

const getBarberProfileFromDB = async (id: string): Promise<{}> => {

    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Barber ID")
    }

    const [barber, portfolios, reviews, rating] = await Promise.all([
        User.findById(id).select("name email profile about address contact gender dateOfBirth").lean(),
        Portfolio.find({ barber: id }).select("image"),
        Review.find({ barber: id }).populate({ path: "barber", select: "name" }).select("barber comment createdAt rating"),
        Review.aggregate([
            {
                $match: { barber: id }
            },
            {
                $group: {
                    _id: null,
                    totalRatingCount: { $sum: 1 }, // Count the total number of ratings
                    totalRating: { $sum: "$rating" } // Calculate the sum of all ratings
                }
            },
            {
                // Project the desired fields and calculate the average rating
                $project: {
                    _id: 0,
                    totalRatingCount: 1,
                    averageRating: { $divide: ["$totalRating", "$totalRatingCount"] } // Calculate average rating
                }
            }
        ])
    ]);

    if (!barber) {
        throw new Error("Barber not found");
    }

    const result = {
        ...barber,
        rating: {
            totalRatingCount: rating[0]?.totalRatingCount || 0,
            averageRating: rating[0]?.averageRating || 0
        },
        satisfiedClients: rating[0]?.totalRatingCount || 0,
        portfolios,
        reviews
    }

    return result;
}

const getCustomerProfileFromDB = async (customer: string): Promise<{}> => {

    if(!mongoose.Types.ObjectId.isValid(customer)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Customer ID")
    }

    const [customerProfile, serviceCount, totalSpend] = await Promise.all([
        User.findById({_id: customer}).select("name profile address gender dateOfBirth").lean(),
        Reservation.countDocuments({ customer: customer, status: "Completed", paymentStatus: "Paid" }),
        Reservation.aggregate([
            {
                $match: { 
                    customer: customer,
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
        ])
    ]);

    if (!customerProfile) {    
        throw new Error("Customer not found");
    }

    const result = {
        ...customerProfile,
        serviceCount,
        totalSpend: totalSpend[0]?.totalSpend || 0
    }

    return result;
}


export const BarberService = {
    getBarberProfileFromDB,
    getCustomerProfileFromDB
}