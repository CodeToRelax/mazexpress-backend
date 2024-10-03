import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ConfigCollection from '@/models/config.model';
import ShipmentsCollection from '@/models/shipments.model';
import UserCollection from '@/models/user.model';
import {
  calculateShippingPriceUtil,
  checkAdminResponsibility,
  countriesEnum,
  generateExternalTrackingNumber,
  sanitizeSearchParam,
} from '@/utils/helpers';
import { sendEmail } from '@/utils/mailtrap';
import { IShipments, IShipmentsFilters, IUpdateShipments, ShipmentPayload } from '@/utils/types';
import { DecodedIdToken } from 'firebase-admin/auth';
import { PaginateOptions } from 'mongoose';

interface Query {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  createdAt?: { $gte?: Date; $lte?: Date };
  [key: string]: unknown; // For additional dynamic properties
}

// pass in filters
const getShipments = async (filters: IShipmentsFilters, paginationOptions?: PaginateOptions, user?: DecodedIdToken) => {
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

  const sortOptions = { createdAt: -1 };

  try {
    const mongoUser = await UserCollection.find({ _id: user?.mongoId });
    let validShipments: unknown = [];
    const userCountry = mongoUser[0]?.address.country;
    const userType = mongoUser[0].userType?.toUpperCase();
    if (user?.mongoId === '6692c0d7888a7f31998c180e') {
      validShipments = await ShipmentsCollection.paginate(query, { ...paginationOptions, sort: sortOptions });
      return validShipments;
    }

    if (mongoUser && userType === 'CUSTOMER') {
      const finalFilters = { ...query, csn: mongoUser[0].uniqueShippingNumber };
      validShipments = await ShipmentsCollection.paginate(finalFilters, { ...paginationOptions, sort: sortOptions });
      return validShipments;
    }

    const adminResults = await ShipmentsCollection.paginate(filters ? query : {}, {
      ...paginationOptions,
      sort: sortOptions,
    });
    const adminAccessableShipments = adminResults.docs.filter((shipment) =>
      checkAdminResponsibility(userCountry as countriesEnum, shipment.status)
    );

    return {
      totalDocs: adminResults.totalDocs,
      totalPages: adminResults.totalPages,
      page: adminResults.page,
      limit: adminResults.limit,
      docs: adminAccessableShipments,
    };
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.getShipmentsError', 'errorMessageTemp', error);
  }
};

const getShipmentsUnpaginated = async (filters?: { status?: string; _id?: string }, user?: DecodedIdToken) => {
  try {
    const mongoUser = await UserCollection.find({ _id: user?.mongoId });
    const customer = await UserCollection.find({ _id: filters?._id });
    let validShipments: IShipments[] = [];
    const adminCountry = mongoUser[0]?.address.country;

    if (user?.mongoId === '6692c0d7888a7f31998c180e') {
      validShipments = await ShipmentsCollection.find({
        status: filters?.status,
        csn: customer[0].uniqueShippingNumber,
      });
      return validShipments;
    }
    if (mongoUser && mongoUser[0].userType === 'CUSTOMER') {
      const finalFilters = { status: filters?.status, csn: mongoUser[0].uniqueShippingNumber };
      validShipments = await ShipmentsCollection.find(finalFilters);
      return validShipments;
    }

    validShipments = await ShipmentsCollection.find({ status: filters?.status, csn: customer[0].uniqueShippingNumber });

    const adminAccessableShipments = validShipments.filter((shipment) =>
      checkAdminResponsibility(adminCountry as countriesEnum, shipment.status)
    );

    return adminAccessableShipments;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.getShipmentsError', 'errorMessageTemp', error);
  }
};

// anyone can check any shipment similar for tracking
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
  // admin user
  const adminUser = await UserCollection.find({ _id: user?.mongoId });
  const customerUser = await UserCollection.find({ uniqueShippingNumber: shipment[0]?.csn.toUpperCase() });
  console.log(shipment);
  console.log(customerUser);
  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    if (body.status !== shipment[0].status) {
      await sendEmail('mohammedzeo.tech@gmail.com', customerUser[0].firstName, shipment[0].esn, body.status);
    }
    return res;
  }
  if (!checkAdminResponsibility(adminUser[0]?.address.country as countriesEnum, shipment[0].status))
    throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  try {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    if (body.status !== shipment[0].status) {
      await sendEmail('mohammedzeo.tech@gmail.com', customerUser[0].firstName, shipment[0].esn, shipment[0].status);
    }
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
  }
};

const updateShipments = async (body: IUpdateShipments, user?: DecodedIdToken) => {
  const shipments = await ShipmentsCollection.find({ _id: { $in: body.shipmentsId } });
  // admin
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.updateMany(
      { _id: { $in: body.shipmentsId } },
      { status: body.shipmentStatus }
    );
    if (res.modifiedCount > 0) {
      shipments.forEach(async (shipment) => {
        console.log(shipment);
        const customer = await UserCollection.find({ uniqueShippingNumber: shipment?.csn.toUpperCase() });
        console.log(customer);
        await sendEmail('mohammedzeo.tech@gmail.com', customer[0].firstName, shipment.esn, body.shipmentStatus);
      });
    }
    return res;
  }

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
    if (res.modifiedCount > 0) {
      shipments.forEach(async (shipment) => {
        console.log(shipment);
        const customer = await UserCollection.find({ uniqueShippingNumber: shipment?.csn });
        console.log(customer);
        await sendEmail('mohammedzeo.tech@gmail.com', customer[0].firstName, shipment.esn, shipment.status);
      });
    }
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
  }
};

const deleteShipment = async (_id: string, user?: DecodedIdToken) => {
  const shipment = await ShipmentsCollection.find({ _id });
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });

  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.findByIdAndDelete(_id);
    return res;
  }

  if (!checkAdminResponsibility(mongoUser[0]?.address.country as countriesEnum, shipment[0].status))
    throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    const res = await ShipmentsCollection.findByIdAndDelete(_id);
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentDeleteError', 'errorMessageTemp', error);
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
  calculateShippingPrice,
};
