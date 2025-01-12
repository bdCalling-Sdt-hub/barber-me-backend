import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BarberService } from "./barber.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getBarberProfile = catchAsync(async (req: Request, res: Response)=> {
    const result = await BarberService.getBarberProfileFromDB(req.params.id, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Barber profile found",
        data: result
    });
});

const getCustomerProfile = catchAsync(async (req: Request, res: Response)=> {
    const result = await BarberService.getCustomerProfileFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Customer profile found",
        data: result
    });
});

const makeDiscount = catchAsync(async (req: Request, res: Response)=> {
    const result = await BarberService.makeDiscountToDB(req.user, req.body.discount);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Discount added successfully",
        data: result
    });
});

const specialOfferBarber = catchAsync(async(req: Request, res: Response)=>{
    const result = await BarberService.specialOfferBarberFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Special Offer Barber data retrieved Successfully",
        data: result
    })
})

const recommendedBarber = catchAsync(async(req: Request, res: Response)=>{
    const result = await BarberService.recommendedBarberFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Recommended Barber data retrieved Successfully",
        data: result
    })
});


const getBarberList = catchAsync(async(req: Request, res: Response)=>{
    const result = await BarberService.getBarberListFromDB(req.user, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Recommended Barber data retrieved Successfully",
        data: result
    })
});



export const BarberController = {
    getBarberProfile,
    getCustomerProfile,
    makeDiscount,
    specialOfferBarber,
    recommendedBarber,
    getBarberList
}