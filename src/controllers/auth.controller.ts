import { IUser, UserTypes } from '@/utils/types';
import { FirebaseController } from './firebase.controller';
import UserCollection from '@/models/user.model';
import { generateAcl, generateRandomUsername, generateShippingNumber } from '@/utils/helpers';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { UserController } from './user.controller';

const createUser = async (body: IUser, customerType: UserTypes) => {
  try {
    const fbUser = await FirebaseController.createFirebaseUser({
      email: body.email,
      password: body.password,
    });
    const mongoUserBody = new UserCollection({
      ...body,
      username: generateRandomUsername(),
      userType: customerType,
      uniqueShippingNumber: generateShippingNumber(customerType, body.address.city),
      acl: JSON.stringify(generateAcl(customerType)),
      firebaseId: fbUser.uid,
      disabled: fbUser.disabled,
    });
    const mongoUser = await mongoUserBody.save();
    await FirebaseController.addFirebaseCustomClaims({
      uid: fbUser.uid,
      customClaims: { mongoId: mongoUser._id },
    });
    return mongoUser;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      console.log(error);
      // mongo error here
      console.error('MongoDB error occurred:');
      throw error;
    }
  }
};

const toggleUser = async (firebaseId: string, status: 'disable' | 'enable') => {
  const filter = { firebaseId };
  try {
    await FirebaseController.toggleFirebaseUser({
      firebaseId,
      status,
    });
    await UserController.updateUser(filter, {
      disabled: status === 'disable' ? true : false,
    });
    return `user ${status} success`;
  } catch (error) {
    throw error;
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

// update user acl // mongo

export const AuthController = {
  createUser,
  toggleUser,
  // adminResetUserPassword,
};
