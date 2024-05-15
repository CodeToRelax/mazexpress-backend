import validator from 'validator';
import { IUserACL, UserTypes, appServices } from './types';
import { Request } from 'express';

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

export const checkUserRules = async (acls: IUserACL, req: Request) => {
  const methodName = req.method as keyof IUserACL;
  const baseUrl = req.baseUrl.slice(1) as appServices;
  const urlPath = req.path as string;
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
      GET: {},
      POST: { auth: ['/signUp'] },
      UPDATE: {},
      DELETE: {},
      PATCH: {},
    };
  }
  return {
    GET: {},
    POST: { auth: ['/signUp'] },
    UPDATE: {},
    DELETE: {},
    PATCH: {},
  };
};
