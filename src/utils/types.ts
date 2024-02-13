export interface IUser {
  username?: string;
  firstName: string;
  lastName: string;
  password: string;
  birthdate: string;
  address: IUserAddress;
  email: string;
  phoneNumber: string;
  privacyPolicy: IUserPrivacyPolicy;
  userType?: keyof typeof UserTypes;
  uniqueShippingNumber?: string;
  acl?: IUserACL;
  firebaseId: string;
}

export interface IUserUpdate
  extends Omit<
    IUser,
    'username' | 'password' | 'email' | 'privacyPolicy' | 'userType' | 'uniqueShippingNumber' | 'acl'
  > {}

export interface ICustomerUpdateProfile {
  firstName: string;
  lastName: string;
  birthdate: string;
}

export interface IUserAddress {
  street: string;
  city: string; // type for libyan cities
  specificDescription?: string;
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
    city: string;
    street: string;
    googleMapsUrl: string;
  };
  youtubeUrl: string;
}

export interface ISystemConfig {
  shippingCost: number;
  shippingFactor: number;
}

const systemServices = ['auth', 'user', 'warehouse'] as const;
type appServices = (typeof systemServices)[number];

const getEndpoints = [] as const;
const postEndpoints = ['/auth/signUp'] as const;
const updateEndpoints = [] as const;
const deleteEndpoints = [] as const;

export interface IUserACL {
  get: {
    [key in appServices]?: (typeof getEndpoints)[number][];
  };
  post: {
    [key in appServices]?: (typeof postEndpoints)[number][];
  };
  update: {
    [key in appServices]?: (typeof updateEndpoints)[number][];
  };
  delete: {
    [key in appServices]?: (typeof deleteEndpoints)[number][];
  };
}

export type IUserStatus = 'enable' | 'disable';
