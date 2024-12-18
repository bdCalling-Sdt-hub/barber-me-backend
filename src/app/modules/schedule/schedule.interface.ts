import { Model, Types } from "mongoose"


interface ITimeProps{
    time: string,
    status: 'booked' | 'available'
}


export type ISchedule={
    professional: Types.ObjectId;
    date: string;
    month: "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";
    year: string;
    times: Array<ITimeProps>
}

export type ScheduleModel = Model<ISchedule>