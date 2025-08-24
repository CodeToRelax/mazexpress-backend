import { Cities, Countries, Gender, IUser, UserTypes } from '@/utils/types';
import mongoose from 'mongoose';
import validator from 'validator';
import paginate from 'mongoose-paginate-v2';
import { validateLibyanNumber } from '@/utils/helpers';

export const UserSchema = new mongoose.Schema(
  {
    firebaseId: { type: String, required: true },
    disabled: { type: Boolean, required: true },
    acl: {
      type: Object,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    birthdate: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        lowercase: true,
      },
      specificDescription: {
        type: String,
        lowercase: true,
        required: false,
      },
      city: {
        type: String,
        required: true,
        lowercase: true,
        enum: Cities,
        default: Cities.BENGHAZI,
      },
      country: {
        type: String,
        lowercase: true,
        enum: Countries,
        default: Countries.LIBYA,
      },
    },
    gender: {
      type: String,
      lowercase: true,
      required: true,
      enum: Gender,
      default: Gender.MALE,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email address used'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      lowercase: true,
      validate: [validateLibyanNumber, 'Invalid phone number used.'],
    },
    userType: {
      type: String,
      required: true,
      lowercase: true,
      enum: UserTypes,
      default: UserTypes.CUSTOMER,
    },
    // this is the user unique shipping number. Something like TIP-3435 for aramex Shop and Ship service
    uniqueShippingNumber: {
      type: String,
      required: true,
    },
    privacyPolicy: {
      usageAgreement: { type: Boolean, required: true },
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(paginate);
interface UserDocument extends mongoose.Document, IUser {}
const UserCollection = mongoose.model<UserDocument, mongoose.PaginateModel<UserDocument>>('User', UserSchema, 'user');
export default UserCollection;
