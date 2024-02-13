import { CustomErrorHandler } from '@/middlewares/error.middleware';
import UserCollection from '@/models/user.model';
import { ICustomerProfileStatus, ICustomerUpdateProfile } from '@/utils/types';
import { FirebaseController } from './firebase.controller';

const getUser = async (_id: string) => {
  const user = UserCollection.findById({ _id });
  return user;
};

// filter and pagination are needed
const getAllUsers = async () => {
  const users = await UserCollection.find({});
  return users;
};

const updateUser = async (filter: object, body: ICustomerUpdateProfile | ICustomerProfileStatus) => {
  try {
    const res = await UserCollection.findOneAndUpdate(filter, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.userUpdateError', 'errorMessageTemp', error);
  }
};

const deleteUser = async (_id: string, fbId: string) => {
  try {
    await FirebaseController.deleteFirebaseUser(fbId);
    const deletedUser = await UserCollection.deleteOne({ _id });
    return deletedUser;
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

export const UserController = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
