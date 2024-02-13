import { ISystemConfig } from '@/utils/types';
import mongoose from 'mongoose';

// add DB error handling
export const ConfigSchema = new mongoose.Schema<ISystemConfig>({
  shippingCost: {
    type: Number,
    required: true,
  },
  shippingFactor: {
    type: Number,
    required: true,
  },
});

const ConfigCollection = mongoose.model<ISystemConfig>('Config', ConfigSchema);
export default ConfigCollection;
