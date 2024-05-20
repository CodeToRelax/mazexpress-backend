import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ShipmentsCollection from '@/models/shipments.model';
import { generateExternalTrackingNumber, sanitizeSearchParam } from '@/utils/helpers';
import { IShipments, IShipmentsFilters, IUpdateShipments } from '@/utils/types';
import { PaginateOptions } from 'mongoose';

// pass in filters
const getShipments = async (paginationOtpions: PaginateOptions, filters: IShipmentsFilters) => {
  try {
    if (filters.searchParam) {
      let query = {};

      if (filters.searchParam) {
        const sanitizedSearchParam = sanitizeSearchParam(filters.searchParam);
        query = {
          $or: [
            { isn: { $regex: sanitizedSearchParam, $options: 'i' } },
            { esn: { $regex: sanitizedSearchParam, $options: 'i' } },
            { csn: { $regex: sanitizedSearchParam, $options: 'i' } },
          ],
        };
      } else {
        query = filters;
      }
      const shipments = await ShipmentsCollection.paginate(query, paginationOtpions);
      return shipments;
    }
    const shipments = await ShipmentsCollection.paginate(filters, paginationOtpions);
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
  const currentDate = new Date();
  const estimatedArrivalDate = new Date(currentDate.setDate(currentDate.getDate() + 7));

  const newShipment: IShipments = {
    ...body,
    esn: generateExternalTrackingNumber(),
    estimatedArrival: estimatedArrivalDate,
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

const updateShipments = async (body: IUpdateShipments) => {
  try {
    const res = await ShipmentsCollection.updateMany(
      { _id: { $in: body.shipmentsId } },
      { status: body.shipmentStatus }
    );
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
  updateShipments,
  deleteShipment,
};
