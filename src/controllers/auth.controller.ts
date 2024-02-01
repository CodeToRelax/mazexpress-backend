import { IUser, IUserStatus } from '@/utils/types';
import { FirebaseController } from './firebase.controller';
import UserCollection from '@/models/user/user.model';
import { generateDefaultAcl, generateUniqueShippingNumber } from '@/utils/helpers';

// signup // mongo and firebase
// getPasswordResetLink // firebase
// change password // firebase
// update user acl // mongo

// admins should not have unique shipping number
const createUser = async (body: IUser) => {
  await FirebaseController.createFirebaseUser({
    email: body.email,
    password: body.password,
  });
  const user = new UserCollection({
    ...body,
    uniqueShippingNumber: body.userType === 'CUSTOMER' ? generateUniqueShippingNumber(body.adress.city) : '0000',
    acl: JSON.stringify(generateDefaultAcl()),
  });
  await user.save();
  return user;
};

const adminResetUserPassword = async (firebaseUid: string, newPassword: string) => {
  const res = await FirebaseController.resetFirebaseUserPassword({
    firebaseUid,
    newPassword,
  });
  return res;
};

const toggleUser = async (firebaseUid: string, status: IUserStatus) => {
  const res = await FirebaseController.toggleFirebaseUser({
    firebaseUid,
    status,
  });
  return res;
};

export const AuthController = {
  createUser,
  adminResetUserPassword,
  toggleUser,
};
