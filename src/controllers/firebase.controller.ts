import { fbAuth } from '@/servers/firebase.server';
import { IUserStatus } from '@/utils/types';
import { UserRecord } from 'firebase-admin/auth';

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

const createFirebaseUser = async (body: ICreateUser): Promise<UserRecord> => {
  try {
    const fbUser = await fbAuth.createUser({
      email: body.email,
      password: body.password,
    });
    return fbUser;
  } catch (error) {
    console.log(error);
    throw error;
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
    throw error;
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
