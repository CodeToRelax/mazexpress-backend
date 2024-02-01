import UserCollection from '@/models/user/user.model';
import { IUserUpdate } from '@/utils/types';

const getUser = async (_id: string) => {
  const user = UserCollection.findById({ _id });
  return user;
};

// filter and pagination are needed
const getUsers = async () => {
  const user = UserCollection.find({});
  return user;
};

const updateUser = async (_id: string, body: IUserUpdate) => {
  const user = await UserCollection.findOneAndUpdate({ _id }, { ...body });
  console.log(user);
  return user;
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
