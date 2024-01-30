export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  birthDate: Date;
  adress: IUserAddress;
  email: string;
  phoneNumber: string;
  privacyPolicy: IUserPrivacyPolicy;
  userType: keyof typeof UserTypes;
  uniqueShippingNumber: string;
  acl: IUserACL;
}

export interface IUserUpdate
  extends Omit<
    IUser,
    'username' | 'password' | 'email' | 'privacyPolicy' | 'userType' | 'uniqueShippingNumber' | 'acl'
  > {}

export interface IUserAddress {
  street: string;
  city: string; // type for libyan cities
  specificDescription?: string;
}

export interface IUserPrivacyPolicy {
  usageAgreement: boolean;
  dataPrivacy: boolean;
}

export enum UserTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

const systemServices = ['auth', 'user', 'warehouse'] as const;
type appServices = (typeof systemServices)[number];

const getEndpoints = [] as const;
const postEndpoints = [] as const;
const updateEndpoints = [] as const;
const deleteEndpoints = [] as const;

export interface IUserACL {
  get: {
    [key in appServices]?: (typeof getEndpoints)[];
  };
  post: {
    [key in appServices]?: (typeof postEndpoints)[];
  };
  update: {
    [key in appServices]?: (typeof updateEndpoints)[];
  };
  delete: {
    [key in appServices]?: (typeof deleteEndpoints)[];
  };
}
