import { IUser, IUserACL, StatusCode } from '@/utils/types';
import { FirebaseController } from './firebase.controller';
import UserCollection from '@/models/user.model';
import { generateAcl, generateRandomUsername, generateShippingNumber } from '@/utils/helpers';
import { CustomErrorHandler } from '@/middlewares/error.middleware';

// create user
const createUser = async (body: IUser & { password: string }) => {
  let fbUser = null;
  try {
    // create firebase user
    fbUser = await FirebaseController.createFirebaseUser({
      email: body.email,
      password: body.password!,
    });
    // setup mongo user body
    const mongoUserBody = new UserCollection({
      ...body,
      username: generateRandomUsername(),
      userType: body.userType,
      uniqueShippingNumber: generateShippingNumber(body.userType, body.address.city),
      acl: generateAcl(body.userType),
      firebaseId: fbUser.uid,
      disabled: fbUser.disabled,
    });
    // create mongo user
    const mongoUser = await mongoUserBody.save();

    // setup custom claims to use in jwt
    await FirebaseController.addFirebaseCustomClaims({
      uid: fbUser.uid,
      customClaims: { mongoId: mongoUser._id, role: body.userType },
    });
    return mongoUser;
  } catch (error) {
    if (fbUser) {
      try {
        await FirebaseController.deleteFirebaseUser(fbUser.uid);
        console.warn(`Rolled back Firebase user: ${fbUser.uid}`);
      } catch (firebaseDeletionError) {
        console.error('Failed to rollback Firebase user:');
        console.error(firebaseDeletionError);
      }
    }
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      console.error('MongoDB error occurred:');
      console.log(error);
      throw error;
    }
  }
};

// update user acl // mongo
const updateUserAcl = async (_id: string, body: IUserACL) => {
  try {
    const res = await UserCollection.findOneAndUpdate({ _id }, { acl: body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_UNAUTHORIZED,
      'common.userUpdateError',
      'Unable to update user access control list',
      error
    );
  }
};

export const AuthController = {
  createUser,
  updateUserAcl,
};
