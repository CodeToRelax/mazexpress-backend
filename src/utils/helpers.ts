import validator from 'validator';
import { Countries, IUser, IUserACL, ShipmentPayload, ShipmentStatus, UserTypes, appServices } from './types';
import { Request } from 'express';
import { CustomErrorHandler } from '@/middlewares/error.middleware';

// *validators

export const validateLibyanNumber = (rawPhone: string): boolean => {
  const phone = rawPhone.trim().replace(/[\s\-]/g, '');
  const libyanRegex = /^(?:\+218|0)?(91|92|94|95)\d{7}$/;
  return libyanRegex.test(phone);
};

export enum countriesEnum {
  LIBYA = 'libya',
  TURKEY = 'turkey',
  CHINA = 'china',
  UAE = 'uae',
}

const countriesPerStatus = {
  [countriesEnum.TURKEY]: ['received at warehouse', 'shipped to destination'],
  [countriesEnum.LIBYA]: ['shipped to destination', 'ready for pick up', 'delivered'],
  [countriesEnum.CHINA]: ['received at warehouse', 'shipped to destination'],
  [countriesEnum.UAE]: ['received at warehouse', 'shipped to destination'],
};

export const getAdminStatusesForCountry = (country: Countries): string[] => {
  return countriesPerStatus[country] || [];
};

export const validateAdminCanDoByCountry = (adminUser: IUser, newStatus: ShipmentStatus) => {
  const country = adminUser?.address.country as Countries;
  const allowedStatuses = getAdminStatusesForCountry(country);
  // normalize your status to lowercase to match your lookup array
  const normalizedStatus = newStatus.toLocaleLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new CustomErrorHandler(
      403,
      'common.unauthorizedRole',
      `User from ${country} cannot set status "${newStatus}"`
    );
  }
};

export const checkAdminResponsibility = (adminCountry?: Countries, status?: string) => {
  if (!adminCountry || !status) return false;
  const allowedStatuses = countriesPerStatus[adminCountry] || [];
  return allowedStatuses.includes(status.toLowerCase());
};

export const validateUserBirthdate = (value: Date) => {
  // expect string type
  if (value > new Date()) return false;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 80);
  if (value < minDate) return false;
  return true;
};

export const sanitizeSearchParam = (searchParam: string | number) => {
  return validator.escape(searchParam.toString());
};

const getBasePath = (urlPath: string) => {
  // Split the URL by '/' and take the first two elements
  const parts = urlPath.split('/');
  // Join the first two parts with '/' to form the base path
  return `${parts[0]}/${parts[1]}`;
};

export const checkUserRules = async (acls: IUserACL, req: Request) => {
  const methodName = req.method as keyof IUserACL;
  const baseUrl = req.baseUrl.slice(1) as appServices;
  const urlPath = getBasePath(req.path);
  console.log(urlPath);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  if (!acls[methodName] || !acls[methodName][baseUrl] || !acls[methodName][baseUrl]?.includes(urlPath)) {
    return false;
  }
  return true;
};

export const generateShippingNumber = (customerType: UserTypes, city: string): string => {
  if (customerType === UserTypes.ADMIN) return '0000';

  // Take the first 3 letters of the city and convert to uppercase
  const prefix: string = city.slice(0, 3).toUpperCase();
  // Generate 3 random numbers
  const randomNumbers: string = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10).toString()).join('');
  // Generate 1 random letter
  const randomLetter: string = String.fromCharCode(Math.floor(Math.random() * 26) + 65);

  // Combine the random numbers and letter in a random order
  const combinedChars: string[] = randomNumbers.split('');
  const randomPosition: number = Math.floor(Math.random() * (randomNumbers.length + 1));
  combinedChars.splice(randomPosition, 0, randomLetter);

  // Ensure that the code contains at least one character after the "-"
  const suffix: string = combinedChars.join('');

  // Combine the prefix and suffix with a hyphen in between
  const result: string = `${prefix}-${suffix}`;

  return result;
};

export const generateTrackingCode = (): string => {
  const letters = Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65));
  const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());

  // Combine letters and numbers
  const combined = letters.concat(numbers);

  // Shuffle the combined array
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
};

export const generateRandomUsername = (length: number = 10): string => {
  return Math.random()
    .toString(20)
    .slice(2, length + 2);
};

export const generateExternalTrackingNumber = (length: number = 10): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

export const generateAcl = (customerType: UserTypes): IUserACL => {
  if (customerType === UserTypes.CUSTOMER) {
    return {
      GET: {
        warehouse: ['/getWarehouses'],
        config: [],
        auth: [],
        user: ['/getUser'],
        shipments: ['/getShipments', '/getShipment'],
        dashboard: [],
      },
      POST: {
        warehouse: [],
        auth: ['/signUp'],
        config: [],
        user: [],
        shipments: [],
      },
      DELETE: {
        warehouse: [],
        user: [],
        shipments: [],
      },
      PATCH: {
        warehouse: [],
        auth: [],
        user: ['/updateProfile'],
        shipments: [],
      },
      UPDATE: {
        warehouse: [],
        auth: [],
        user: [],
        shipments: [],
      },
    };
  }
  return {
    GET: {
      warehouse: ['/getWarehouses'],
      config: ['/getShippingConfig'],
      auth: [],
      user: ['/getAllUsers', '/getAllUsersUnpaginated', '/getUser'],
      shipments: ['/getShipments', '/getShipmentsUnpaginated', '/getShipment', '/getInvoiceShipments'],
      dashboard: ['/getShipmentsStatusCount', '/getUserAndShipmentCountPerYear', '/getOrdersPerDay'],
    },
    POST: {
      warehouse: ['/createWarehouse'],
      auth: [],
      config: ['/updateShippingConfig'],
      user: ['/createUser'],
      shipments: ['/createShipment'],
    },
    DELETE: {
      warehouse: ['/deleteWarehouse', '/deleteShipments'],
      user: [],
      shipments: [],
    },
    PATCH: {
      warehouse: ['/updateWarehouse'],
      auth: [],
      user: ['/toggleUser', '/updateUser', '/updateProfile'],
      shipments: ['/updateShipment', '/updateShipments', '/updateShipmentsEsn'],
    },
    UPDATE: {
      warehouse: [],
      auth: [],
      user: [],
      shipments: [],
    },
  };
};

export const calculateShippingPriceUtil = (
  shippingMethod: ShipmentPayload['shippingMethod'],
  weight: ShipmentPayload['weight'],
  dimensions: ShipmentPayload['dimensions'],
  dollarPrice: number,
  libyanExchangeRate: number
) => {
  const actualWeight = parseFloat(weight ? weight : '0');
  let dimensionalWeight;

  // Calculate dimensional weight
  if (dimensions && dimensions.length && dimensions.width && dimensions.height) {
    const length = parseFloat(dimensions.length);
    const width = parseFloat(dimensions.width);
    const height = parseFloat(dimensions.height);

    if (shippingMethod === 'sea') {
      dimensionalWeight = (length * width * height) / 4720;
    } else if (shippingMethod === 'air') {
      dimensionalWeight = (length * width * height) / 5000;
    }
  }

  // Use the greater of actual weight or dimensional weight
  const finalWeight = dimensionalWeight && dimensionalWeight > actualWeight ? dimensionalWeight : actualWeight;

  let price = 0;
  const usdPrice = Number(dollarPrice * libyanExchangeRate);

  // Calculate the price based on shipping method
  if (shippingMethod === 'sea') {
    price = finalWeight * 2.5; // Price for sea shipping in dinar
  } else if (shippingMethod === 'air') {
    price = finalWeight * usdPrice; // Price for air shipping in USD
  }

  return price;
};
