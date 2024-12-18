import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ServiceService } from "./service.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createService = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.createServiceToDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service created Successfully",
        data: result
    })
})

const updateService = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.updateServiceToDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service updated Successfully",
        data: result
    })
})

const getService = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.getServiceFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service Retrieved Successfully",
        data: result
    })
})

export const ServiceController = {
    createService,
    updateService,
    getService
}