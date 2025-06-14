import { IWarehouse } from '@/utils/types';
import mongoose from 'mongoose';
import validator from 'validator';

// add DB error handling
export const WarehouseSchema = new mongoose.Schema<IWarehouse>({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  address: {
    doorNumber: {
      type: String,
      lowercase: true,
    },
    buildingNumber: {
      type: String,
      lowercase: true,
    },
    street: {
      type: String,
      lowercase: true,
    },
    neighborhood: {
      type: String,
      lowercase: true,
    },
    district: {
      type: String,
      lowercase: true,
    },
    city: {
      type: String,
      lowercase: true,
    }, // type for Libya or turkey cities
    country: {
      type: String,
      lowercase: true,
    }, // type for Libya or turkey
    googleMapsUrl: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      lowercase: true,
      required: true,
    },
  },
  phoneNumber: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  youtubeUrl: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});

const WarehouseCollection = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export default WarehouseCollection;
