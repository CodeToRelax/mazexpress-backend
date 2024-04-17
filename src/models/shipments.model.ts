import { IShipments } from '@/utils/types';
import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

// add DB error handling
export const ShipmentsSchema = new mongoose.Schema({
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
    length: {
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
  extraCosts: {
    type: Number,
    required: true,
    lowercase: true,
  },
  note: {
    type: String,
    required: true,
    lowercase: true,
  },
  status: {
    type: String,
    required: true,
    lowercase: true,
  },
});

ShipmentsSchema.plugin(paginate);

interface ShipmentDocument extends mongoose.Document, IShipments {}

const ShipmentsCollection = mongoose.model<ShipmentDocument, mongoose.PaginateModel<ShipmentDocument>>(
  'Shipments',
  ShipmentsSchema,
  'shipments'
);
export default ShipmentsCollection;
