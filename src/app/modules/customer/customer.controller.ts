import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CustomerService } from "./customer.service";
import sendResponse from "../../../shared/sendResponse";

const customerProfile= catchAsync(async(req: Request, res: Response)=>{
    const result = await CustomerService.customerProfileFromDB(req.user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Customer profile found",
        data: result
    })
});

export const CustomerController = {
    customerProfile
}