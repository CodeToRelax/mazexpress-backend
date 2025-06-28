import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ConfigCollection from '@/models/config.model';
import ShipmentsCollection from '@/models/shipments.model';
import UserCollection from '@/models/user.model';
import {
  calculateShippingPriceUtil,
  checkAdminResponsibility,
  generateExternalTrackingNumber,
  getAdminStatusesForCountry,
  sanitizeSearchParam,
  validateAdminCanDoByCountry,
} from '@/utils/helpers';
import {
  IDeleteShipments,
  IShipments,
  IShipmentsFilters,
  IUpdateShipments,
  IUpdateShipmentsEsn,
  ShipmentPayload,
  StatusCode,
  UserTypes,
} from '@/utils/types';
import { DecodedIdToken } from 'firebase-admin/auth';
import { PaginateOptions } from 'mongoose';

const mohammedMongoId = process.env.MOHAMMED_MONGO_ID;

const getShipments = async (paginationOptions: PaginateOptions, filters: IShipmentsFilters, user?: DecodedIdToken) => {
  let query: Record<string, unknown> = {};

  // Handle searchParam
  if (filters.searchParam) {
    const sanitizedSearchParam = sanitizeSearchParam(filters.searchParam);
    query.$or = [
      { isn: { $regex: sanitizedSearchParam, $options: 'i' } },
      { esn: { $regex: sanitizedSearchParam, $options: 'i' } },
      { csn: { $regex: sanitizedSearchParam, $options: 'i' } },
    ];
  } else {
    query = { ...filters };
  }

  // Handle date range
  if (filters.from || filters.to) {
    const createdAtFilter: Record<string, Date> = {};
    if (filters.from) createdAtFilter.$gte = new Date(filters.from);
    if (filters.to) createdAtFilter.$lte = new Date(filters.to);
    query.createdAt = createdAtFilter;

    delete query.from;
    delete query.to;
  }

  const sortOptions = { createdAt: -1 };
  const shouldPaginate = paginationOptions.pagination !== false;

  try {
    const mongoUsers = await UserCollection.find({ _id: user?.mongoId });
    const mongoUser = mongoUsers[0];

    if (!mongoUser) {
      throw new Error('User not found in database');
    }

    const userCountry = mongoUser.address?.country;
    const userType = mongoUser.userType?.toLowerCase();

    // Special case: Mohammed gets all shipments
    if (user?.mongoId === mohammedMongoId) {
      if (shouldPaginate) {
        return await ShipmentsCollection.paginate(query, {
          ...paginationOptions,
          sort: sortOptions,
        });
      } else {
        return await ShipmentsCollection.find(query)
          .sort((paginationOptions.sort as string) || 'asc')
          .lean();
      }
    }

    // Customer: filter by CSN
    if (userType === UserTypes.CUSTOMER) {
      const finalFilters = {
        ...query,
        csn: mongoUser.uniqueShippingNumber,
      };
      if (shouldPaginate) {
        return await ShipmentsCollection.paginate(finalFilters, {
          ...paginationOptions,
          sort: sortOptions,
        });
      } else {
        return await ShipmentsCollection.find(finalFilters)
          .sort((paginationOptions.sort as string) || 'asc')
          .lean();
      }
    }

    // Admin: filter post-query

    const adminStatuses = getAdminStatusesForCountry(userCountry);
    const adminFilters = {
      ...query,
      status: { $in: adminStatuses },
    };

    if (shouldPaginate) {
      return await ShipmentsCollection.paginate(adminFilters, {
        ...paginationOptions,
        sort: sortOptions,
      });
    } else {
      return await ShipmentsCollection.find(adminFilters)
        .sort((paginationOptions.sort as string) || 'asc')
        .lean();
    }
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.getShipmentsError',
      'errorMessageTemp',
      error
    );
  }
};

const getShipment = async (shipmentEsn: string) => {
  try {
    const user = ShipmentsCollection.findOne({ esn: shipmentEsn });
    return user;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.createShipmentError',
      'errorMessageTemp',
      error
    );
  }
};

const createShipment = async (body: IShipments) => {
  const currentDate = new Date();
  const estimatedArrivalDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // seven days for shipment arrival
  const newShipment: IShipments = {
    ...body,
    isn: body.isn ? body.isn : '',
    esn: generateExternalTrackingNumber(),
    estimatedArrival: estimatedArrivalDate,
  };

  try {
    const shipmentInstance = new ShipmentsCollection(newShipment);
    const newShipmentSaveFile = await shipmentInstance.save();
    return newShipmentSaveFile;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.createShipmentError',
      'errorMessageTemp',
      error
    );
  }
};

const updateShipment = async (_id: string, body: IShipments, user?: DecodedIdToken) => {
  const adminUser = await UserCollection.find({ _id: user?.mongoId });

  if (user?.mongoId === mohammedMongoId) {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    return res;
  }
  validateAdminCanDoByCountry(adminUser[0], body.status);

  try {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.shipmentUpdateError',
      'errorMessageTemp',
      error
    );
  }
};

const updateShipments = async (body: IUpdateShipments, user?: DecodedIdToken) => {
  // admin
  const admin = await UserCollection.find({ _id: user?.mongoId });

  if (user?.mongoId === mohammedMongoId) {
    const res = await ShipmentsCollection.updateMany(
      { _id: { $in: body.shipmentsId } },
      { status: body.shipmentStatus }
    );
    return res;
  }

  validateAdminCanDoByCountry(admin[0], body.shipmentStatus);

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

const deleteShipment = async (body: IDeleteShipments, user?: DecodedIdToken) => {
  const shipments = await ShipmentsCollection.find({ _id: { $in: body.shipmentsId } });
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  if (user?.mongoId === mohammedMongoId) {
    const res = await ShipmentsCollection.deleteMany({ _id: { $in: body.shipmentsId } });
    return res;
  }
  for (const shipment of shipments) {
    if (!checkAdminResponsibility(userCountry, shipment.status)) {
      throw new CustomErrorHandler(
        StatusCode.CLIENT_ERROR_BAD_REQUEST,
        'unauthorized personnel',
        'unauthorized personnel'
      );
    }
  }
  try {
    const res = await ShipmentsCollection.deleteMany({ _id: { $in: body.shipmentsId } });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.shipmentDeleteError',
      'errorMessageTemp',
      error
    );
  }
};

const calculateShippingPrice = async (body: ShipmentPayload) => {
  const config = await ConfigCollection.findOneAndUpdate({ _id: '65db6c55d3a4d41e6ac96432' }, { ...body });
  if (!config?.shippingCost || !config?.libyanExchangeRate) {
    return 'Online Calculation is paused now';
  }
  const finalPrice = calculateShippingPriceUtil(
    body.shippingMethod,
    body.weight,
    body.dimensions,
    config?.shippingCost,
    config?.libyanExchangeRate
  );
  try {
    return finalPrice;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.shipmentDeleteError',
      'errorMessageTemp',
      error
    );
  }
};

// needs checking

const updateShipmentsEsn = async (body: IUpdateShipmentsEsn, user?: DecodedIdToken) => {
  // admin
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.updateMany(
      { esn: { $in: body.shipmentsEsn } },
      { status: body.shipmentStatus }
    );
    // sending email
    // if (res.modifiedCount > 0) {
    //   shipments.forEach(async (shipment) => {
    //     console.log(shipment);
    //     const customer = await UserCollection.find({ uniqueShippingNumber: shipment?.csn.toUpperCase() });
    //     console.log(customer);
    //     await sendEmail('mohammedzeo.tech@gmail.com', customer[0].firstName, shipment.esn, body.shipmentStatus);
    //   });
    // }
    return res;
  }

  if (!checkAdminResponsibility(userCountry, body.shipmentStatus)) {
    throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
  }
  try {
    const res = await ShipmentsCollection.updateMany(
      { esn: { $in: body.shipmentsEsn } },
      { status: body.shipmentStatus }
    );
    // send email
    // if (res.modifiedCount > 0) {
    //   shipments.forEach(async (shipment) => {
    //     console.log(shipment);
    //     const customer = await UserCollection.find({ uniqueShippingNumber: shipment?.csn });
    //     console.log(customer);
    //     await sendEmail('mohammedzeo.tech@gmail.com', customer[0].firstName, shipment.esn, shipment.status);
    //   });
    // }
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
  }
};

export const ShipmentsController = {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  updateShipments,
  updateShipmentsEsn,
  deleteShipment,
  calculateShippingPrice,
};
