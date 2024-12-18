import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

interface IStripeAccountInfo {
    status?: boolean;
    stripeAccountId?: string;
    externalAccountId?: string;
    accountUrl?: string;
    currency?: string;
}

interface IAuthenticationProps {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    name: string;
    appId?: string;
    role: USER_ROLES;
    contact: string;
    email: string;
    password: string;
    isSubscribed?: boolean;
    location: {};
    profile: string;
    verified: boolean;
    authentication?: IAuthenticationProps;
    accountInformation?: IStripeAccountInfo;
}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isAccountCreated(id: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;