import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import mongoose from "mongoose";

const createPackageToDB = async(payload: IPackage): Promise<IPackage | null>=>{
    const result = await Package.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Package")
    }

    return result;
}

const updatePackageToDB = async(id: string, payload: IPackage): Promise<IPackage | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }

    const result = await Package.findByIdAndUpdate(
        {_id: id},
        payload,
        { new: true } 
    );

    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Update Package")
    }

    return result;
}


const getPackageFromDB = async(): Promise<IPackage[]>=>{
    const result = await Package.find();
    return result;
}

const getPackageDetailsFromDB = async(id: string): Promise<IPackage | null>=>{
    const result = await Package.findById(id);
    return result;
}

export const PackageService = {
    createPackageToDB,
    updatePackageToDB,
    getPackageFromDB,
    getPackageDetailsFromDB
}