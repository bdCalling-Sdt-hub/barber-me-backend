import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Portfolio } from "../portfolio/portfolio.model";
import { Review } from "../review/review.model";

const getBarberProfileFromDB = async (user: JwtPayload): Promise<{}> => {

    const [barber, portfolios, reviews, rating] = await Promise.all([
        User.findById(user.id).select("name email profile about address contact gender dateOfBirth").lean(),
        Portfolio.find({ barber: user.id }).select("image"),
        Review.find({ barber: user.id }).populate({ path: "barber", select: "name" }).select("barber comment createdAt rating"),
        Review.aggregate([
            {
                $match: { barber: user.id }
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

export const BarberService = {
    getBarberProfileFromDB
}