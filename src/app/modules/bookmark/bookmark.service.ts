import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IBookmark } from "./bookmark.interface";
import { Bookmark } from "./bookmark.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const toggleBookmark = async (payload: {user: JwtPayload, service: string}): Promise<string> => {

    if(!mongoose.Types.ObjectId.isValid(payload.service)){
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Invalid ")
    }

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({
        user: payload.user,
        service: payload.service
    });

    if (existingBookmark) {
        // If the bookmark exists, delete it
        await Bookmark.findByIdAndDelete(existingBookmark._id);
        return "Bookmark Remove successfully";
    } else {

        // If the bookmark doesn't exist, create it
        const result = await Bookmark.create(payload);
        if (!result) {
            throw new ApiError(StatusCodes.EXPECTATION_FAILED, "Failed to add bookmark");
        }
        return "Bookmark Added successfully";
    }
};


const getBookmark = async (user: JwtPayload): Promise<IBookmark[]>=>{



    const result:any = await Bookmark.find({ user: user?.id })
        .populate({
            path: 'service',
            model: 'Service'
        }).select("service")
    

    return result;
}

export const BookmarkService = {toggleBookmark, getBookmark}