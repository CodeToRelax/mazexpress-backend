import { DecodedIdToken } from 'firebase-admin/auth';
import { Request } from 'express';

export interface CustomExpressRequest extends Request {
  user?: DecodedIdToken;
  role?: UserTypes;
}

export interface IUser {
  username?: string;
  firstName: string;
  lastName: string;
  password?: string;
  birthdate: string;
  address: IUserAddress;
  email: string;
  phoneNumber: string;
  privacyPolicy: IUserPrivacyPolicy;
  userType?: keyof typeof UserTypes;
  uniqueShippingNumber?: string;
  acl: string;
  firebaseId: string;
  disabled: boolean;
  gender: UserGender;
}

export interface IGetAllUsersFilters extends IUser {
  searchParam: string;
}

export interface IUserUpdate
  extends Omit<
    IUser,
    'username' | 'password' | 'email' | 'privacyPolicy' | 'userType' | 'uniqueShippingNumber' | 'acl'
  > {}

export type UserGender = 'male' | 'female';

export interface ICustomerUpdateProfile {
  firstName: string;
  lastName: string;
  birthdate: string;
  disabled?: boolean;
}

export interface ICustomerProfileStatus {
  disabled: boolean;
}

export interface IAdminUpdateProfile {
  firstName: string;
  lastName: string;
  birthdate: string;
  address: IUserAddress;
  phoneNumber: string;
}

export interface IUserAddress {
  street: string;
  city: string; // type for libyan cities
  specificDescription?: string;
  country: string;
}

export enum Cities {
  BENGHAZI = 'benghazi',
  ISTANBUL = 'istanbul',
  TRIPOLI = 'tripoli',
  MUSRATA = 'musrata',
}

export enum Countries {
  LIBYA = 'libya',
  TURKEY = 'turkey',
}

export interface IUserPrivacyPolicy {
  usageAgreement: boolean;
}

export enum UserTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export interface IWarehouse {
  name: string;
  address: {
    doorNumber: string;
    buldingNumber: string;
    street: string;
    neighborhood: string;
    district: string;
    city: string;
    countr: string;
    googleMapsUrl: string;
  };
  phoneNumber: string;
  email: string;
  youtubeUrl: string;
  imageUrl: string;
}

export interface IShipments {
  isn: string;
  esn: string;
  csn: string;
  size: {
    weight: number;
    height: number;
    width: number;
    length: number;
  };
  shipmentDestination: Cities;
  shippingMethod: shippingMethod;
  extraCosts: number;
  note: string;
  status: string;
  estimatedArrival: Date;
}

export interface IUpdateShipments {
  shipmentsId: string[];
  shipmentStatus: string;
}

export interface IShipmentsFilters extends IShipments {
  searchParam: string;
}

export type shipmentDestination = 'benghazi' | 'musrata' | 'tripoli';
export type shippingMethod = 'air' | 'sea';

export interface ISystemConfig {
  shippingCost: number;
  shippingFactor: number;
}

export interface IUpdateUserAdmin {
  firstName: string;
  lastName: string;
  birthdate: string;
  address: IUserAddress;
  phoneNumber: string;
}

const systemServices = ['auth', 'user', 'warehouse'] as const;
export type appServices = (typeof systemServices)[number];

const getEndpoints = ['/getShippingConfig'] as const;
const postEndpoints = ['/signUp', '/updateShippingConfig'] as const;
const updateEndpoints = [] as const;
const deleteEndpoints = [] as const;
const patchEndpoints = [] as const;

export interface IUserACL {
  GET: {
    [key in appServices]?: (typeof getEndpoints)[number][];
  };
  POST: {
    [key in appServices]?: (typeof postEndpoints)[number][];
  };
  UPDATE: {
    [key in appServices]?: (typeof updateEndpoints)[number][];
  };
  DELETE: {
    [key in appServices]?: (typeof deleteEndpoints)[number][];
  };
  PATCH: {
    [key in appServices]?: (typeof patchEndpoints)[number][];
  };
}

export type IUserStatus = 'enable' | 'disable';
