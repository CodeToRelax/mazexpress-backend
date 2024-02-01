export const validateLibyanNumber = (phoneNumber: string) => {
  const allowedCarriers = ['91', '92', '94', '95'];
  const firstTwoNumbers = phoneNumber.slice(0, 2);
  return allowedCarriers.includes(firstTwoNumbers) && phoneNumber.length === 9 ? true : false;
};

export const validateUserBirthdate = (value: Date) => {
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
