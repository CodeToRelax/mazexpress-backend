import { ISystemConfig } from '@/utils/types';
import mongoose from 'mongoose';

// add DB error handling
export const ConfigSchema = new mongoose.Schema<ISystemConfig>({
  shippingCost: {
    type: Number,
    required: true,
    unique: true,
  },
  shippingFactorSea: {
    type: Number,
    required: true,
    unique: true,
  },
  shippingFactor: {
    type: Number,
    required: true,
    unique: true,
  },
  libyanExchangeRate: {
    type: Number,
    required: true,
    unique: true,
  },
  seaShippingPrice: {
    type: Number,
    required: true,
    unique: true,
  },
});

const ConfigCollection = mongoose.model<ISystemConfig>('Config', ConfigSchema);
export default ConfigCollection;
