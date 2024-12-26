import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IService } from "./service.interface";
import { Service } from "./service.model";
import mongoose, { UpdateWriteOpResult } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import unlinkFile from "../../../shared/unlinkFile";
import { Bookmark } from "../bookmark/bookmark.model";

const createServiceToDB = async (payload: IService[]): Promise<IService[] | null> => {

    if (!payload || payload.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No services provided");
    }

    // retrieved existing services based on the payload
    const existingServices = await Service.find({
        $or: payload.map(service => ({
            title: service.title,
            category: service.category,
            barber: service.barber
        }))
    });

    // Filter payload to exclude existing services
    const filteredPayload = payload.filter(service =>
        !existingServices.some(existing =>
            existing.title.toString() === service.title.toString() &&
            existing.category.toString() === service.category.toString() &&
            existing.barber.toString() === service.barber.toString()
        )
    );

    // Delete existing services
    if (existingServices.length > 0) {
        await Service.deleteMany({
            $or: existingServices?.map(service => ({
                title: service.title,
                category: service.category,
                barber: service.barber
            }))
        });
    }

    // Step 4: If no new services to insert, return an error
    if (filteredPayload.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "All provided services already exist");
    }

    // Insert the new services
    const insertedServices = await Service.insertMany(filteredPayload);
    if (!insertedServices || insertedServices.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create services");
    }

    // Return the newly created services
    return insertedServices;
};


const updateServiceToDB = async (id: string, payload: IService): Promise<IService | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Service Object ID")
    }

    const isExistService = await Service.findById(id);
    if (isExistService?.image?.startsWith("/images")) {
        unlinkFile(isExistService.image as string);
    }

    const result = await Service.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );

    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Update Service")
    }

    return result;
}


const getServiceForBarberFromDB = async (user: JwtPayload, category: string): Promise<IService[]> => {
    const result = await Service.find({ barber: user.id, category: category })
        .select("title duration price image");
    return result;
}

// hold service
const holdServiceFromDB = async (user: JwtPayload): Promise<UpdateWriteOpResult> => {

    const result = await Service.updateMany(
        { barber: user.id },
        { status: "Inactive" },
        { new: true }
    );

    return result;
}

const specialOfferServiceFromDB = async (user: JwtPayload, category: string): Promise<IService[]> => {

    const condition: Record<string, any> = {
        isOffered: true
    }

    if( category && !mongoose.Types.ObjectId.isValid(category)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Category ID")
    }

    if(category){
        condition['category'] = category;
    }


    const result: IService[] = await Service.find(condition)
        .select("title rating totalRating barber image")
        .populate([
            {
                path: "barber",
                select: "name"
            },
            {
                path: "category",
                select: "name"
            },
            {
                path: "title",
                select: "title"
            }
        ])
        .lean()
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Service not found")
    }

    const services = await Promise.all(result.map(async (service: any) => {
        const isFavorite = await Bookmark.findOne({ service: service._id, barber: service.barber, customer: user.id });
        return { ...service, isBookmarked: !!isFavorite };

    }));

    return services;
}

const recommendedServiceFromDB = async (user: JwtPayload, category: string): Promise<IService[]> => {

    const condition: Record<string, any> = {
        rating: { $gte: 0  }
    }

    if( category && !mongoose.Types.ObjectId.isValid(category)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Category ID")
    }

    if(category){
        condition['category'] = category;
    }


    const result: IService[] = await Service.find(condition)
        .select("title rating totalRating barber image")
        .populate([
            {
                path: "barber",
                select: "name"
            },
            {
                path: "category",
                select: "name"
            },
            {
                path: "title",
                select: "title"
            }
        ])
        .lean()
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Service not found")
    }

    const services = await Promise.all(result.map(async (service: any) => {
        const isFavorite = await Bookmark.findOne({ service: service._id, barber: service.barber, customer: user.id });
        return { ...service, isBookmarked: !!isFavorite };

    }));

    return services;
}


export const ServiceService = {
    createServiceToDB,
    updateServiceToDB,
    getServiceForBarberFromDB,
    holdServiceFromDB,
    specialOfferServiceFromDB,
    recommendedServiceFromDB
}