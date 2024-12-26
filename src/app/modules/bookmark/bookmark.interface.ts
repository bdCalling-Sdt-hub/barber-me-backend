import { Model, Types } from "mongoose";

export type IBookmark= {
    customer: Types.ObjectId;
    barber: Types.ObjectId;
    service: Types.ObjectId
}

export type BookmarkModel = Model<IBookmark>;