import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ShipmentsCollection from '@/models/shipments.model';
import UserCollection from '@/models/user.model';
import {
  checkAdminResponsibility,
  countriesEnum,
  generateExternalTrackingNumber,
  sanitizeSearchParam,
} from '@/utils/helpers';
import { IShipments, IShipmentsFilters, IUpdateShipments } from '@/utils/types';
import { DecodedIdToken } from 'firebase-admin/auth';
import { PaginateOptions } from 'mongoose';

interface Query {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  createdAt?: { $gte?: Date; $lte?: Date };
  [key: string]: unknown; // For additional dynamic properties
}

// pass in filters
const getShipments = async (filters: IShipmentsFilters, paginationOptions?: PaginateOptions) => {
  try {
    let query: Query = {};

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
      query = { ...filters };
    }
    // Handle date filters
    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) {
        const fromDate = new Date(filters.from);
        query.createdAt.$gte = fromDate;
      }
      if (filters.to) {
        const toDate = new Date(filters.to);
        query.createdAt.$lte = toDate;
      }
      delete query.from;
      delete query.to;
    }

    console.log(query);

    // Fetch shipments based on the constructed query
    const shipments = await ShipmentsCollection.paginate(query, paginationOptions);
    return shipments;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.getShipmentsError', 'errorMessageTemp', error);
  }
};

const getShipmentsUnpaginated = async (filters?: { status: string; _id: string }) => {
  try {
    const shipments = await ShipmentsCollection.find(filters ? filters : {});
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
    isn: body.isn ? body.isn : '',
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

const updateShipment = async (_id: string, body: IShipments, user?: DecodedIdToken) => {
  const shipment = await ShipmentsCollection.find({ _id });
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  if (!checkAdminResponsibility(mongoUser[0]?.address.country as countriesEnum, shipment[0].status))
    throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  try {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
  }
};

const updateShipments = async (body: IUpdateShipments, user?: DecodedIdToken) => {
  const shipments = await ShipmentsCollection.find({ _id: { $in: body.shipmentsId } });
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  for (const shipment of shipments) {
    if (!checkAdminResponsibility(userCountry as countriesEnum, shipment.status)) {
      throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
    }
  }
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

const deleteShipment = async (_id: string, user?: DecodedIdToken) => {
  const shipment = await ShipmentsCollection.find({ _id });
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  if (!checkAdminResponsibility(mongoUser[0]?.address.country as countriesEnum, shipment[0].status))
    throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

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
  getShipmentsUnpaginated,
};
