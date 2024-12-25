import { Model, Types } from "mongoose";

export type IReport = {
    customer: Types.ObjectId;
    barber: Types.ObjectId;
    service: Types.ObjectId;
    reason: [];
};

export type ReportModel = Model<IReport, Record<string, unknown>>;