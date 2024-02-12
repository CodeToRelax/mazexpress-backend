import { IWarehouse } from '@/utils/types';
import mongoose from 'mongoose';

// add DB error handling
export const WarehouseSchema = new mongoose.Schema<IWarehouse>({
  name: {
    type: String,
    required: true,
    lowercase: true,
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
    }, // type for Libya or turkey
    googleMapsUrl: {
      type: String,
      required: true,
    },
  },
  youtubeUrl: {
    type: String,
    required: false,
  },
});

const WarehouseCollection = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export default WarehouseCollection;
