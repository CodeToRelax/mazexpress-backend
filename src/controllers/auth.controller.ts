import { IUser, IUserStatus } from '@/utils/types';
import { FirebaseController } from './firebase.controller';
import UserCollection from '@/models/user/user.model';
import { generateDefaultAcl, generateRandomUsername, generateUniqueShippingNumber } from '@/utils/helpers';
import { CustomErrorHandler } from '@/middlewares/error.middleware';

const signUp = async (body: IUser) => {
  try {
    const fbUser = await FirebaseController.createFirebaseUser({
      email: body.email,
      password: body.password,
    });
    const mongoUserBody = new UserCollection({
      ...body,
      username: generateRandomUsername(),
      userType: 'CUSTOMER',
      uniqueShippingNumber: generateUniqueShippingNumber(body.address.city),
      acl: JSON.stringify(generateDefaultAcl()),
    });
    const mongoUser = await mongoUserBody.save();
    await FirebaseController.addFirebaseCustomClaims({
      uid: fbUser.uid,
      customClaims: { mongoId: mongoUser._id },
    });
    return mongoUser;
  } catch (error) {
    throw new CustomErrorHandler(403, 'common.signUpError', 'common.signUpFailed', error);
  }
};

// const adminResetUserPassword = async (firebaseUid: string, newPassword: string) => {
//   const res = await FirebaseController.resetFirebaseUserPassword({
//     firebaseUid,
//     newPassword,
//   });
//   return res;
// };

// change password // firebase

// const toggleUser = async (firebaseUid: string, status: IUserStatus) => {
//   const res = await FirebaseController.toggleFirebaseUser({
//     firebaseUid,
//     status,
//   });
//   return res;
// };

// update user acl // mongo

export const AuthController = {
  signUp,
  // adminResetUserPassword,
  // toggleUser,
};
