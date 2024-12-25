import { model, Schema } from "mongoose";
import { IReport, ReportModel } from "./report.interface";
import { Service } from "../service/service.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const reportSchema = new Schema<IReport, ReportModel>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        barber: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        service: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        reason: [
            {
                type: String,
                required: true
            }
        ]
    },
    { timestamps: true }
);


//check user
reportSchema.pre('save', async function (next) {

    const report = this as IReport;

    const updatedService = await Service.findOneAndUpdate(
        { _id: report.service },
        { isReported: true },
        { new: true }
    );

    if (!updatedService) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Service Not Found'));
    }

    next();
});


export const Report = model<IReport, ReportModel>("Report", reportSchema);