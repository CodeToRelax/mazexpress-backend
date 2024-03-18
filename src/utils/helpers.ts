import { IUserACL, UserTypes } from './types';

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

// const getUserRules = async (req, res, next) => {
//   try {
//     //extract and decode JWT
//     const extractedToken = extractJwt(req);
//     const decodedToken = decodeJwt(extractedToken);

//     //get rules from dynamo
//     const TableName = dynamoTable;
//     let queryParams = {
//       KeyConditionExpression: "PK = :PK AND begins_with (SK, :SK)",
//       ExpressionAttributeValues: {
//         ":PK": decodedToken.sub,
//         ":SK": `user_rules`,
//       },
//       TableName,
//     };
//     const userRules = await dynamoV2.query(queryParams).promise();

//     //check if rules match req type, baseUrl and path
//     if (
//       !userRules.Items[0].rules[req.method] ||
//       !userRules.Items[0].rules[req.method][req.baseUrl] ||
//       !userRules.Items[0].rules[req.method][req.baseUrl].includes(req.path)
//     ) {
//       return res.status(401).json("unathorized access to resource");
//     }
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json("unathorized access to resource");
//   }
// };

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
      get: {},
      post: { auth: ['/auth/signUp'] },
      update: {},
      delete: {},
    };
  }
  return {
    get: {},
    post: { auth: ['/auth/signUp'] },
    update: {},
    delete: {},
  };
};
