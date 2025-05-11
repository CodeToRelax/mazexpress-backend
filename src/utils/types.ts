import { DecodedIdToken } from 'firebase-admin/auth';
import { Request } from 'express';

export enum Gender {
  MALE = 'male',
  FEMALe = 'female',
}

export enum Cities {
  BENGHAZI = 'benghazi',
  TRIPOLI = 'tripoli',
  MUSRATA = 'musrata',
  ISTANBUL = 'istanbul',
}

export enum Countries {
  LIBYA = 'libya',
  TURKEY = 'turkey',
}

export enum UserTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum ToggleState {
  ENABLE = 'enable',
  DISABLE = 'disable',
}

export interface IUserAddress {
  street: string;
  city: Cities;
  specificDescription?: string;
  country: Countries;
}
export interface IUserPrivacyPolicy {
  usageAgreement: boolean;
}

export interface IUser {
  username?: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  address: IUserAddress;
  email: string;
  phoneNumber: string;
  privacyPolicy: IUserPrivacyPolicy;
  userType: UserTypes;
  uniqueShippingNumber: string;
  acl: string;
  firebaseId: string;
  disabled: boolean;
  gender: UserGender;
}
export interface IGetAllUsersFilters extends IUser {
  searchParam: string;
  from: string;
  to: string;
  paginate: boolean;
}

export interface CustomExpressRequest extends Request {
  user?: DecodedIdToken;
  role?: UserTypes;
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

export interface IWarehouseAddress {
  doorNumber: string;
  buldingNumber: string;
  street: string;
  neighborhood: string;
  district: string;
  city: string;
  countr: string;
  googleMapsUrl: string;
}

export interface IWarehouse {
  name: string;
  address: IWarehouseAddress;
  phoneNumber: string;
  email: string;
  youtubeUrl: string;
  imageUrl: string;
}

export enum ShippingMethod {
  SEA = 'sea',
  AIR = 'air',
  land = 'land',
}

export enum ShipmentStatus {
  RECEIVED_AT_WAREHOUSE = 'received at warehouse',
  SHIPPED_TO_DESTINATION = 'shipped to destination',
  READY_FOR_PICK_UP = 'ready for pick up',
  DELIVERED = 'delivered',
}

export interface IShipmentSize {
  weight: number;
  height: number;
  width: number;
  length: number;
}
export interface IShipments {
  isn: string;
  esn: string;
  csn: string;
  size: IShipmentSize;
  shipmentDestination: Cities;
  shippingMethod: ShippingMethod;
  extraCosts: number;
  note: string;
  status: ShipmentStatus;
  estimatedArrival: Date;
}

export interface IUpdateShipments {
  shipmentsId: string[];
  shipmentStatus: ShipmentStatus;
}

export interface IUpdateShipmentsEsn {
  shipmentsEsn: string[];
  shipmentStatus: string;
}

export interface IDeleteShipments {
  shipmentsId: string[];
}

export interface IShipmentsFilters extends IShipments {
  searchParam: string;
  from: string;
  to: string;
}

export type shipmentDestination = 'benghazi' | 'musrata' | 'tripoli';

export interface ISystemConfig {
  shippingCost: number;
  shippingFactor: number;
  libyanExchangeRate: number;
  seaShippingPrice: number;
}

export interface IUpdateUserAdmin {
  firstName: string;
  lastName: string;
  birthdate: string;
  address: IUserAddress;
  phoneNumber: string;
}

const systemServices = ['auth', 'user', 'warehouse', 'config', 'shipments', 'dashboard'] as const;
export type appServices = (typeof systemServices)[number];

const getEndpoints = [
  '/getShippingConfig',
  '/getWarehouses',
  '/acl',
  '/getAllUsers',
  '/getAllUsersUnpaginated',
  '/getUser',
  '/getShipments',
  '/getShipmentsUnpaginated',
  '/getShipment',
  '/getInvoiceShipments',
  '/getShipmentsStatusCount',
  '/getUserAndShipmentCountPerYear',
] as const;
const postEndpoints = [
  '/signUp',
  '/updateShippingConfig',
  '/createWarehouse',
  '/createUser',
  '/createShipment',
] as const;
const updateEndpoints = [] as const;
const deleteEndpoints = ['/deleteWarehouse', '/deleteUser', '/deleteShipment'] as const;
const patchEndpoints = [
  '/updateWarehouse',
  '/acl',
  '/toggleUser',
  '/updateUser',
  '/updateProfile',
  '/updateShipment',
  '/updateShipments',
  '/updateShipmentsEsn',
] as const;

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

interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export interface ShipmentPayload {
  shippingMethod: ShippingMethod;
  dimensions?: Dimensions; // Optional field, since weight could also be used instead of dimensions
  weight?: string; // Optional field, only present if dimensions are not used
}

export enum StatusCode {
  CLIENT_ERROR_BAD_REQUEST = 400,
  CLIENT_ERROR_CONFLICT = 409,
  CLIENT_ERROR_EXPECTATION_FAILED = 417,
  CLIENT_ERROR_FAILED_DEPENDENCY = 424,
  CLIENT_ERROR_FORBIDDEN = 403,
  CLIENT_ERROR_GONE = 410,
  CLIENT_ERROR_I_M_A_TEAPOT = 418,
  CLIENT_ERROR_LENGTH_REQUIRED = 411,
  CLIENT_ERROR_LOCKED = 423,
  CLIENT_ERROR_LOGIN_TIMEOUT = 440,
  CLIENT_ERROR_METHOD_NOT_ALLOWED = 405,
  CLIENT_ERROR_MISDIRECTED_REQUEST = 421,
  CLIENT_ERROR_NOT_ACCEPTABLE = 406,
  CLIENT_ERROR_NOT_FOUND = 404,
  CLIENT_ERROR_PAYLOAD_TOO_LARGE = 413,
  CLIENT_ERROR_PAYMENT_REQUIRED = 402,
  CLIENT_ERROR_PRECONDITION_FAILED = 412,
  CLIENT_ERROR_PRECONDITION_REQUIRED = 428,
  CLIENT_ERROR_PROXY_AUTH_REQUIRED = 407,
  CLIENT_ERROR_RANGE_NOT_SATISFIABLE = 416,
  CLIENT_ERROR_REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  CLIENT_ERROR_REQUEST_TIMEOUT = 408,
  CLIENT_ERROR_RETRY_WITH = 449,
  CLIENT_ERROR_TOO_MANY_REQUESTS = 429,
  CLIENT_ERROR_UNAUTHORIZED = 401,
  CLIENT_ERROR_UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  CLIENT_ERROR_UNPROCESSABLE_ENTITY = 422,
  CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE = 415,
  CLIENT_ERROR_UPGRADE_REQUIRED = 426,
  CLIENT_ERROR_URI_TOO_LONG = 414,
  INFO_CONTINUE = 100,
  INFO_PROCESSING = 102,
  INFO_SWITCHING_PROTOCOLS = 101,
  REDIRECT_FOUND = 302,
  REDIRECT_MOVED_PERMANENTLY = 301,
  REDIRECT_MULTIPLE_CHOICES = 300,
  REDIRECT_NOT_MODIFIED = 304,
  REDIRECT_PERMANENT = 308,
  REDIRECT_SEE_OTHER = 303,
  REDIRECT_SWITCH_PROXY = 306,
  REDIRECT_TEMP = 307,
  REDIRECT_USE_PROXY = 305,
  SERVER_ERROR_BAD_GATEWAY = 502,
  SERVER_ERROR_BANDWIDTH_LIMIT_EXCEEDED = 509,
  SERVER_ERROR_GATEWAY_TIMEOUT = 504,
  SERVER_ERROR_HTTP_VERSION_NOT_SUPPORTED = 505,
  SERVER_ERROR_INSUFFICIENT_STORAGE = 507,
  SERVER_ERROR_INTERNAL = 500,
  SERVER_ERROR_LOOP_DETECTED = 508,
  SERVER_ERROR_NETWORK_AUTH_REQUIRED = 511,
  SERVER_ERROR_NOT_EXTENDED = 510,
  SERVER_ERROR_NOT_IMPLEMENTED = 501,
  SERVER_ERROR_SERVICE_UNAVAILABLE = 503,
  SERVER_ERROR_VARIANT_ALSO_NEGOTIATES = 506,
  SUCCESS_ACCEPTED = 202,
  SUCCESS_ALREADY_REPORTED = 208,
  SUCCESS_CREATED = 201,
  SUCCESS_IM_USED = 229,
  SUCCESS_MULTI_STATUS = 207,
  SUCCESS_NO_CONTENT = 204,
  SUCCESS_NON_AUTHORITATIVE_INFO = 203,
  SUCCESS_OK = 200,
  SUCCESS_PARTIAL_CONTENT = 206,
  SUCCESS_RESET_CONTENT = 205,
}
