import validator from 'validator';
import { IUserACL, UserTypes, appServices } from './types';
import { Request } from 'express';

export enum countriesEnum {
  LIBYA = 'libya',
  TURKEY = 'turkey',
}

const countriesPerStatus = {
  [countriesEnum.TURKEY]: ['recieved at warehouse', 'shipped to destination'],
  [countriesEnum.LIBYA]: ['ready for pick up', 'delivered'],
};

export const validateLibyanNumber = (phoneNumber: string) => {
  const allowedCarriers = ['91', '92', '94', '95'];
  const firstTwoNumbers = phoneNumber.slice(0, 2);
  return allowedCarriers.includes(firstTwoNumbers) && phoneNumber.length === 9 ? true : false;
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
      config: [],
      auth: [],
      user: ['/getAllUsers', '/getAllUsersUnpaginated', '/getUser'],
      shipments: ['/getShipments', '/getShipmentsUnpaginated', '/getShipment', '/getInvoiceShipments'],
      dashboard: ['/getShipmentsStatusCount', '/getUserAndShipmentCountPerYear'],
    },
    POST: {
      warehouse: [],
      auth: [],
      config: [],
      user: ['/createUser'],
      shipments: ['/createShipment'],
    },
    DELETE: {
      warehouse: [],
      user: [],
      shipments: [],
    },
    PATCH: {
      warehouse: ['/updateWarehouse'],
      auth: [],
      user: ['/toggleUser', '/updateUser', '/updateProfile'],
      shipments: ['/updateShipment', '/updateShipments'],
    },
    UPDATE: {
      warehouse: [],
      auth: [],
      user: [],
      shipments: [],
    },
  };
};

export const checkAdminResponsibility = (adminCountry: countriesEnum, status: string) => {
  return countriesPerStatus[adminCountry].includes(status.toLocaleLowerCase());

  // create object with country keys
  // check if status exists in this admin country key
};
