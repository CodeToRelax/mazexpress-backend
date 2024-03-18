import { IShipments } from '@/utils/types';
import mongoose from 'mongoose';

// add DB error handling
export const ShipmentsSchema = new mongoose.Schema<IShipments>({
  isn: {
    type: String,
    required: true,
    lowercase: true,
  },
  esn: {
    type: String,
    required: true,
    lowercase: true,
  },
  csn: {
    type: String,
    required: true,
    lowercase: true,
  },
  size: {
    weight: {
      type: Number,
      lowercase: true,
      required: true,
    },
    height: {
      type: Number,
      lowercase: true,
      required: true,
    },
    width: {
      type: Number,
      lowercase: true,
      required: true,
    },
  },
  shipmentDestination: {
    type: String,
    required: true,
    lowercase: true,
  },
  shippingMethod: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const ShipmentsCollection = mongoose.model<IShipments>('Shipments', ShipmentsSchema);
export default ShipmentsCollection;
