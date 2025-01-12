import { Model, Types } from 'mongoose';

export type ISubCategory = {
    barber: Types.ObjectId;
    category: Types.ObjectId;
    title: string;
}
export type SubCategoryModel = Model<ISubCategory, Record<string, unknown>>