import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IBanner } from "./banner.interface";
import { Banner } from "./banner.model";
import unlinkFile from "../../../shared/unlinkFile";

const createBannerToDB = async (image: string): Promise<IBanner | null> => {

    if (!image) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Image is required");
    }

    const createBanner:any = await Banner.create({image: image});
    if (!createBanner) {
        unlinkFile(image as string)
        throw new ApiError(StatusCodes.OK, "Failed to created banner");
    }
  
    return createBanner;
};

const getAllBannerFromDB = async (): Promise<IBanner[]>=> {
    return await Banner.find({});
};

const updateBannerToDB = async (id: string, image:string): Promise<IBanner | {}> => {

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Invalid ID")
    }
  
    const isBannerExist = await Banner.findById(id);
  
    if (image) {
        unlinkFile(isBannerExist?.image as string);
    }
  
    const banner:any = await Banner.findOneAndUpdate(
        { _id: id }, 
        {image: image}, 
        {new: true}
    );
    return banner;
};
  
const deleteBannerToDB = async (id: string): Promise<IBanner | undefined> => {
  
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Invalid ")
    }
  
    const isBannerExist = await Banner.findById({_id: id});
  
    //delete from folder
    if(isBannerExist){
        unlinkFile(isBannerExist?.image as string);
    }
  
    //delete from database
    await Banner.findByIdAndDelete(id);
    return; 
};


export const BannerService = {
    createBannerToDB, 
    getAllBannerFromDB, 
    updateBannerToDB, 
    deleteBannerToDB
}