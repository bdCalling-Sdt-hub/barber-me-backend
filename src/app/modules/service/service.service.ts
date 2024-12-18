import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IService } from "./service.interface";
import { Service } from "./service.model";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const createServiceToDB = async(payload: IService): Promise<IService | null>=>{
    const result = await Service.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Service")
    }

    return result;
}

const updateServiceToDB = async(id: string, payload: IService): Promise<IService | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }

    const result = await Service.findByIdAndUpdate(
        {_id: id},
        payload,
        { new: true } 
    );

    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Update Service")
    }

    return result;
}


const getServiceFromDB = async(user: JwtPayload): Promise<IService[]>=>{
    const result = await Service.find({professional: user.id});
    return result;
}

export const ServiceService = {
    createServiceToDB,
    updateServiceToDB,
    getServiceFromDB
}