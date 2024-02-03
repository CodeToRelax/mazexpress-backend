import { IUser, IUserStatus } from '@/utils/types';
import { FirebaseController } from './firebase.controller';
import UserCollection from '@/models/user/user.model';
import { generateDefaultAcl, generateRandomUsername, generateUniqueShippingNumber } from '@/utils/helpers';

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
    username: generateRandomUsername(),
    userType: 'CUSTOMER',
    uniqueShippingNumber: generateUniqueShippingNumber(body.address.city),
    acl: JSON.stringify(generateDefaultAcl()),
  });

  // TODO delete user if mongo fails
  const res = await user.save();
  return res;
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
