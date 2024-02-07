import { IUser } from '@/utils/types';
import mongoose from 'mongoose';
import validator from 'validator';

// add DB error handling
export const UserSchema = new mongoose.Schema<IUser>({
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
  password: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 8,
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
    city: {
      type: String,
      required: true,
      lowercase: true,
    }, // type for libyan cities
    specificDescription: {
      type: String,
      lowercase: true,
    },
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
    type: String,
    required: true,
  },
});

UserSchema.virtual('fullName').get(function () {
  const fullName: string = `${this.firstName[0].toUpperCase() + this.firstName.slice(1)} ${this.lastName[0].toUpperCase() + this.lastName.slice(1)}`;
  return fullName;
});

const UserCollection = mongoose.model<IUser>('User', UserSchema);
export default UserCollection;
