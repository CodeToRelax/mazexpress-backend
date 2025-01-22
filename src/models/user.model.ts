import { Cities, Countries, IUser } from '@/utils/types';
import mongoose from 'mongoose';
import validator from 'validator';
import paginate from 'mongoose-paginate-v2';
import { required } from 'joi';

// add DB error handling
export const UserSchema = new mongoose.Schema(
  {
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
    // password: {
    //   type: String,
    //   required: true,
    //   lowercase: true,
    //   minlength: 8,
    // },
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
      },
      country: {
        type: String,
        lowercase: true,
        enum: Countries,
      },
    },
    gender: {
      type: String,
      lowercase: true,
      required: true,
      enum: ['male', 'female'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, 'invalid email'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      lowercase: true,
    },
    privacyPolicy: {
      usageAgreement: { type: Boolean, required: true },
    },
    userType: {
      type: String,
      required: true,
      lowercase: true,
    },
    uniqueShippingNumber: {
      type: String,
      required: true,
    },
    acl: {
      type: Object,
      required: true,
    },
    firebaseId: { type: String, required: true },
    disabled: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(paginate);

interface UserDocument extends mongoose.Document, IUser {}

const UserCollection = mongoose.model<UserDocument, mongoose.PaginateModel<UserDocument>>('User', UserSchema, 'user');

export default UserCollection;
