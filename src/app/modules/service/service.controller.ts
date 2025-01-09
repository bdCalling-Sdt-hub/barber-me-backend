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

const getServiceForBarber = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.getServiceForBarberFromDB(req.user, req.query.category as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service Retrieved Successfully",
        data: result
    })
})

const holdService = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.holdServiceFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service Hold Successfully",
        data: result
    })
})

const specialOfferService = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.specialOfferServiceFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Special Offer Service retrieved Successfully",
        data: result
    })
})

const recommendedService = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.recommendedServiceFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Recommended Service retrieved Successfully",
        data: result
    })
})

const getServiceList = catchAsync(async(req: Request, res: Response)=>{
    const result = await ServiceService.getServiceListFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service List retrieved Successfully",
        data: result
    })
})

export const ServiceController = {
    createService,
    updateService,
    getServiceForBarber,
    holdService,
    specialOfferService,
    recommendedService,
    getServiceList
}