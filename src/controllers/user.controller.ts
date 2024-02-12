import { CustomErrorHandler } from '@/middlewares/error.middleware';
import UserCollection from '@/models/user/user.model';
import { ICustomerUpdateProfile } from '@/utils/types';

const getUser = async (_id: string) => {
  const user = UserCollection.findById({ _id });
  return user;
};

// filter and pagination are needed
const getUsers = async () => {
  const user = UserCollection.find({});
  return user;
};

const updateUser = async (_id: string, body: ICustomerUpdateProfile) => {
  try {
    const res = await UserCollection.findOneAndUpdate({ _id }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.userUpdateError', 'errorMessageTemp', error);
  }
};

const deleteUser = async (_id: string) => {
  const deletedUser = await UserCollection.deleteOne({ _id });
  return deletedUser;
};

export const UserController = {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
