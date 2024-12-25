import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BarberService } from "./barber.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getBarberProfile = catchAsync(async (req: Request, res: Response)=> {
    const result = await BarberService.getBarberProfileFromDB(req.user);

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

export const BarberController = {
    getBarberProfile,
    getCustomerProfile
}