import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IService } from "./service.interface";
import { Service } from "./service.model";
import mongoose, { UpdateWriteOpResult } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import unlinkFile from "../../../shared/unlinkFile";
import { Bookmark } from "../bookmark/bookmark.model";
import { Category } from "../category/category.model";
import { SubCategory } from "../subCategory/subCategory.model";
import getDistanceFromCoordinates from "../../../shared/getDistanceFromCordinance";

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

const specialOfferServiceFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<{ services: IService[], meta: { page: number, total: number } }> => {

    const { category, coordinates, page, limit } = query;

    const pages = parseInt(page as string) || 1;
    const size = parseInt(limit as string) || 10;
    const skip = (pages - 1) * size;

    const condition: Record<string, any> = {
        isOffered: true
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Category ID")
    }

    if (category) {
        condition['category'] = category;
    }

    if (!coordinates) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Please Provide coordinates")
    }


    const result: IService[] = await Service.find(condition)
        .select("title rating totalRating isOffered barber image")
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
        .skip(skip)
        .limit(size);
    
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Service not found")
    }
    const count = await Service.countDocuments(condition);
    const services = await Promise.all(result.map(async (service: any) => {
        const isFavorite = await Bookmark.findOne({ service: service._id, barber: service.barber, customer: user?.id });
        const distance = await getDistanceFromCoordinates(service?.barber?.location?.coordinates, JSON?.parse(coordinates));
        return {
            ...service,
            distance: distance ? distance : null,
            isBookmarked: !!isFavorite
        };

    }));

    const data: any = {
        services,
        meta: {
            page: pages,
            total: count
        }
    }

    return data;
}

const recommendedServiceFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<{ services: IService[], meta: { page: number, total: number } }> => {

    const { category, coordinates, page, limit } = query;

    const pages = parseInt(page as string) || 1;
    const size = parseInt(limit as string) || 10;
    const skip = (pages - 1) * size;

    const condition: Record<string, any> = {
        rating: { $gte: 0 }
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Category ID")
    }

    if (category) {
        condition['category'] = category;
    }


    const result: IService[] = await Service.find(condition)
        .select("title rating totalRating barber isOffered image")
        .populate([
            {
                path: "barber",
                select: "name location"
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
        .skip(skip)
        .limit(size);

        
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Service not found")
    }

    const count = await Service.countDocuments(condition);

    if (!coordinates) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Please Provide coordinates")
    }

    const services = await Promise.all(result.map(async (service: any) => {
        const isFavorite = await Bookmark.findOne({ service: service._id, barber: service.barber, customer: user?.id });
        const distance = await getDistanceFromCoordinates(service?.barber?.location?.coordinates, JSON?.parse(coordinates));
        return {
            ...service,
            distance: distance ? distance : null,
            isBookmarked: !!isFavorite
        };

    }));

    const data: any = {
        services,
        meta: {
            page: pages,
            total: count
        }
    }

    return data;
}

const getServiceListFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<{ services: IService[], meta: { page: number, total: number } }> => {
    const { minPrice, maxPrice, page, limit, coordinates, search, ...othersQuery } = query;

    if (!coordinates) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Please Provide coordinates")
    }

    const anyConditions: Record<string, any>[] = [];

    if (search) {

        const categoriesID = await Category.find({ name: { $regex: search, $options: "i" } }).distinct("_id");
        const subCategoriesID = await SubCategory.find({ title: { $regex: search, $options: "i" } }).distinct("_id");

        anyConditions.push({
            $or: [
                { title: { $in: subCategoriesID } },
                { category: { $in: categoriesID } }
            ]
        })
    }

    if (minPrice && maxPrice) {
        anyConditions.push({
            price: {
                $gte: parseFloat(minPrice),
                $lte: parseFloat(maxPrice)
            }
        });
    }

    // Additional filters for other fields
    if (Object.keys(othersQuery).length) {
        anyConditions.push({
            $and: Object.entries(othersQuery).map(([field, value]) => ({
                [field]: value
            }))
        });
    }

    const pages = parseInt(page as string) || 1;
    const size = parseInt(limit as string) || 10;
    const skip = (pages - 1) * size;

    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const result = await Service.find(whereConditions).select("rating isOffered discount totalRating barber image")
        .populate([
            {
                path: "barber",
                select: "name location"
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
        .skip(skip)
        .limit(size)

    if (!result.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Service not found")
    }

    const count = await Service.countDocuments(whereConditions);

    const services = await Promise.all(result.map(async (service: any) => {
        const isFavorite = await Bookmark.findOne({ service: service._id, barber: service.barber, customer: user?.id });
        const distance = await getDistanceFromCoordinates(service?.barber?.location?.coordinates, JSON?.parse(coordinates));
        return {
            ...service,
            distance: distance ? distance : null,
            isBookmarked: !!isFavorite
        };
    }));

    const data: any = {
        services,
        meta: {
            page: pages,
            total: count
        }
    }

    return data;
}


export const ServiceService = {
    createServiceToDB,
    updateServiceToDB,
    getServiceForBarberFromDB,
    holdServiceFromDB,
    specialOfferServiceFromDB,
    recommendedServiceFromDB,
    getServiceListFromDB
}