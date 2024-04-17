import { CustomErrorHandler } from '@/middlewares/error.middleware';
import UserCollection from '@/models/user.model';
import {
  IAdminUpdateProfile,
  ICustomerProfileStatus,
  ICustomerUpdateProfile,
  IGetAllUsersFilters,
} from '@/utils/types';
import { FirebaseController } from './firebase.controller';
import { PaginateOptions } from 'mongoose';
import { sanitizeSearchParam } from '@/utils/helpers';

const getUser = async (_id: string) => {
  const user = UserCollection.findById({ _id });
  return user;
};

// filter and pagination are needed
const getAllUsers = async (paginationOtpions: PaginateOptions, filters: IGetAllUsersFilters) => {
  if (filters.searchParam) {
    let query = {};
    if (filters.searchParam) {
      const sanitizedSearchParam = sanitizeSearchParam(filters.searchParam);
      query = {
        $or: [
          { email: { $regex: sanitizedSearchParam, $options: 'i' } },
          { firstName: { $regex: sanitizedSearchParam, $options: 'i' } },
          { lastName: { $regex: sanitizedSearchParam, $options: 'i' } },
          { uniqueShippingNumber: { $regex: sanitizedSearchParam, $options: 'i' } },
          { phoneNumber: { $regex: sanitizedSearchParam, $options: 'i' } },
        ],
      };
    } else {
      query = filters;
    }

    const users = await UserCollection.paginate(query, paginationOtpions);
    return users;
  }

  const users = await UserCollection.paginate(filters, paginationOtpions);
  return users;
};

const updateUser = async (
  filter: object,
  body: ICustomerUpdateProfile | ICustomerProfileStatus | IAdminUpdateProfile
) => {
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

const toggleUser = async (firebaseId: string, status: 'disable' | 'enable') => {
  const filter = { firebaseId };
  try {
    await FirebaseController.toggleFirebaseUser({
      firebaseId,
      status,
    });
    await updateUser(filter, {
      disabled: status === 'disable' ? true : false,
    });
    return `user ${status} success`;
  } catch (error) {
    throw error;
  }
};

export const UserController = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  toggleUser,
};
