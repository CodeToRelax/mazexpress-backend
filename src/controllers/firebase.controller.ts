import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { fbAuth } from '@/servers/firebase.server';
import { isFirebaseAuthError } from '@/utils/helpers';
import { IUserStatus } from '@/utils/types';
import { FirebaseError } from '@firebase/util';

interface ICreateUser {
  email: string;
  password: string;
}

interface IToggleUser {
  firebaseUid: string;
  status: IUserStatus;
}

interface IResetPassword {
  firebaseUid: string;
  newPassword: string;
}

const createFirebaseUser = async (body: ICreateUser) => {
  try {
    await fbAuth.createUser({
      email: body.email,
      password: body.password,
    });
  } catch (error) {
    const err = error as FirebaseError;
    if (isFirebaseAuthError(error)) throw new CustomErrorHandler('common.signUp', err.message, 'firebase', 403);
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
    await fbAuth.updateUser(body.firebaseUid, {
      disabled: body.status === 'disable' ? true : false,
    });
    return `user ${body.status}`;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const FirebaseController = {
  createFirebaseUser,
  resetFirebaseUserPassword,
  toggleFirebaseUser,
};
