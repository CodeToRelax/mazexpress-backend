import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ShipmentsCollection from '@/models/shipments.model';
import { generateExternalTrackingNumber } from '@/utils/helpers';
import { IShipments } from '@/utils/types';

// pass in filters
const getShipments = async () => {
  try {
    const shipments = await ShipmentsCollection.find({});
    return shipments;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.getShipmentsError', 'errorMessageTemp', error);
  }
};

const getShipment = async (shipmentEsn: string) => {
  const user = ShipmentsCollection.findOne({ esn: shipmentEsn });
  return user;
};

const createShipment = async (body: IShipments) => {
  const newShipment: IShipments = {
    ...body,
    esn: generateExternalTrackingNumber(),
  };
  try {
    const shipmentInstance = new ShipmentsCollection(newShipment);
    const newWarehouse = await shipmentInstance.save();
    return newWarehouse;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.createShipmentError', 'errorMessageTemp', error);
  }
};

const updateShipment = async (_id: string, body: IShipments) => {
  try {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
  }
};

const deleteShipment = async (_id: string) => {
  try {
    const res = await ShipmentsCollection.findByIdAndDelete(_id);
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentDeleteError', 'errorMessageTemp', error);
  }
};

export const ShipmentsController = {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment,
};
