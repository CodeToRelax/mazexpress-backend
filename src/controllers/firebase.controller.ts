import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { IUserStatus } from '@/utils/types';
import { FirebaseError } from 'firebase-admin';
import { fbAuth } from '..';
interface ICreateUser {
  email: string;
  password: string;
}

interface IToggleUser {
  firebaseId: string;
  status: IUserStatus;
}

interface IResetPassword {
  firebaseUid: string;
  newPassword: string;
}

interface IUserCustomClaims {
  uid: string;
  customClaims: object;
}

const createFirebaseUser = async (body: ICreateUser) => {
  try {
    return await fbAuth.createUser({
      email: body.email,
      password: body.password,
    });
  } catch (error) {
    const err = error as FirebaseError;
    throw new CustomErrorHandler(403, err.code, err.message, error);
  }
};

const resetFirebaseUserPassword = async (body: IResetPassword): Promise<string> => {
  try {
    await fbAuth.updateUser(body.firebaseUid, {
      password: body.newPassword,
    });
    return `password reset successfully`;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

const toggleFirebaseUser = async (body: IToggleUser): Promise<string> => {
  try {
    await fbAuth.updateUser(body.firebaseId, {
      disabled: body.status === 'disable' ? true : false,
    });
    return `user ${body.status}`;
  } catch (error) {
    const err = error as FirebaseError;
    throw new CustomErrorHandler(403, err.code, err.message, error);
  }
};

const addFirebaseCustomClaims = async (body: IUserCustomClaims) => {
  try {
    return await fbAuth.setCustomUserClaims(body.uid, body.customClaims);
  } catch (error) {
    const err = error as FirebaseError;
    throw new CustomErrorHandler(403, 'common.addUserAttributeError', err.message, error);
  }
};

const deleteFirebaseUser = async (fbId: string) => {
  try {
    return await fbAuth.deleteUser(fbId);
  } catch (error) {
    const err = error as FirebaseError;
    throw new CustomErrorHandler(403, err.code, err.message, error);
  }
};

export const FirebaseController = {
  createFirebaseUser,
  resetFirebaseUserPassword,
  toggleFirebaseUser,
  addFirebaseCustomClaims,
  deleteFirebaseUser,
};
