import { IUserStatus } from '@/utils/types';
import { FirebaseController } from './firebase.controller';

// signup // mongo and firebase
// getPasswordResetLink // firebase
// change password // firebase
// update user acl // mongo

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
  adminResetUserPassword,
  toggleUser,
};
