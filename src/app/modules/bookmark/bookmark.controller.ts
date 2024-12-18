import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookmarkService } from "./bookmark.service";

const toggleBookmark = catchAsync(async(req: Request, res: Response)=>{
    const customer = req.user.id;
    const barber = req.body.barber;
    const payload:any = { customer, barber }
    const result = await BookmarkService.toggleBookmark(payload);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result
    })
});

const getBookmark = catchAsync(async(req: Request, res: Response)=>{
    const user = req.user;
    const result = await BookmarkService.getBookmark(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookmark Retrieved Successfully",
        data: result
    })
});


export const BookmarkController = {toggleBookmark, getBookmark}