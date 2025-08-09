import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ConfigCollection from '@/models/config.model';
import ShipmentsCollection from '@/models/shipments.model';
import UserCollection from '@/models/user.model';
import {
  calculateShippingPriceUtil,
  checkAdminResponsibility,
  generateExternalTrackingNumber,
  sanitizeSearchParam,
} from '@/utils/helpers';
// import { sendEmail } from '@/utils/mailtrap';
import {
  IDeleteShipments,
  IShipments,
  IShipmentsFilters,
  IUpdateShipments,
  IUpdateShipmentsEsn,
  ShipmentPayload,
  UserTypes,
  Countries,
  ShipmentStatus,
} from '@/utils/types';
import { DecodedIdToken } from 'firebase-admin/auth';
import { PaginateOptions } from 'mongoose';

interface Query {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  createdAt?: { $gte?: Date; $lte?: Date };
  [key: string]: unknown; // For additional dynamic properties
}

// Libya-specific restriction: non-domestic shipments in these statuses are hidden/blocked for Libya admins
const LIBYA_RESTRICTED_STATUSES: ReadonlyArray<ShipmentStatus> = [
  ShipmentStatus.RECEIVED_AT_WAREHOUSE,
  ShipmentStatus.SHIPPED_TO_DESTINATION,
];

const appendLibyaVisibilityToQuery = (base: Query): Query => {
  return {
    $and: [base, { $or: [{ isDomestic: true }, { status: { $nin: LIBYA_RESTRICTED_STATUSES } }] }],
  } as unknown as Query;
};

const isRestrictedForLibya = (shipment?: IShipments): boolean => {
  if (!shipment) return false;
  const nonDomestic = shipment.isDomestic !== true; // treat undefined/null as international (non-domestic)
  const restricted = LIBYA_RESTRICTED_STATUSES.includes(shipment.status as ShipmentStatus);
  return nonDomestic && restricted;
};

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

    // Admins: apply Libya-specific visibility rule to the DB query to keep pagination consistent
    if (userCountry === Countries.LIBYA) {
      query = appendLibyaVisibilityToQuery(query);
    }

    const adminResults = await ShipmentsCollection.paginate(filters ? query : {}, {
      ...paginationOptions,
      sort: sortOptions,
    });
    const adminAccessableShipments = adminResults.docs.filter((shipment) =>
      checkAdminResponsibility(userCountry as Countries, shipment.status)
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
    if (mongoUser && mongoUser[0].userType === UserTypes.CUSTOMER) {
      const finalFilters = { status: filters?.status, csn: mongoUser[0].uniqueShippingNumber };
      validShipments = await ShipmentsCollection.find(finalFilters);
      return validShipments;
    }

    let findQuery: Query = {
      status: filters?.status as ShipmentStatus,
      csn: customer[0].uniqueShippingNumber,
    } as unknown as Query;
    if (adminCountry === Countries.LIBYA) {
      findQuery = appendLibyaVisibilityToQuery(findQuery);
    }
    validShipments = (await ShipmentsCollection.find(
      findQuery as unknown as Record<string, unknown>
    )) as unknown as IShipments[];

    const adminAccessableShipments = validShipments.filter((shipment) =>
      checkAdminResponsibility(adminCountry as Countries, shipment.status)
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
    // if (body.status !== shipment[0].status) {
    // await sendEmail('mohammedzeo.tech@gmail.com', customerUser[0].firstName, shipment[0].esn, body.status);
    // }
    return res;
  }
  const adminCountry = adminUser[0]?.address.country as Countries;
  if (adminCountry === Countries.LIBYA && isRestrictedForLibya(shipment[0])) {
    throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
  }
  if (!checkAdminResponsibility(adminCountry, body.status)) {
    throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  }
  try {
    const res = await ShipmentsCollection.findOneAndUpdate({ _id }, { ...body });
    // if (body.status !== shipment[0].status) {
    //   await sendEmail('mohammedzeo.tech@gmail.com', customerUser[0].firstName, shipment[0].esn, shipment[0].status);
    // }
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
  }
};

const updateShipments = async (body: IUpdateShipments, user?: DecodedIdToken) => {
  // admin
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.updateMany(
      { _id: { $in: body.shipmentsId } },
      { status: body.shipmentStatus }
    );
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

  // Libya: block updates on non-domestic shipments in restricted statuses
  if (userCountry === Countries.LIBYA) {
    const shipments = (await ShipmentsCollection.find({ _id: { $in: body.shipmentsId } })) as unknown as IShipments[];
    for (const s of shipments) {
      if (isRestrictedForLibya(s)) {
        throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
      }
    }
  }
  if (!checkAdminResponsibility(userCountry as Countries, body.shipmentStatus)) {
    throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
  }
  try {
    const res = await ShipmentsCollection.updateMany(
      { _id: { $in: body.shipmentsId } },
      { status: body.shipmentStatus }
    );
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

const updateShipmentsEsn = async (body: IUpdateShipmentsEsn, user?: DecodedIdToken) => {
  // admin
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.updateMany(
      { esn: { $in: body.shipmentsEsn } },
      { status: body.shipmentStatus }
    );

    console.log(res);
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

  // Libya: block updates on non-domestic shipments in restricted statuses
  if (userCountry === Countries.LIBYA) {
    const shipments = (await ShipmentsCollection.find({ esn: { $in: body.shipmentsEsn } })) as unknown as IShipments[];
    for (const s of shipments) {
      if (isRestrictedForLibya(s)) {
        throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
      }
    }
  }
  if (!checkAdminResponsibility(userCountry as Countries, body.shipmentStatus)) {
    throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
  }
  try {
    const res = await ShipmentsCollection.updateMany(
      { esn: { $in: body.shipmentsEsn } },
      { status: body.shipmentStatus }
    );
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

const deleteShipment = async (body: IDeleteShipments, user?: DecodedIdToken) => {
  const shipments = await ShipmentsCollection.find({ _id: { $in: body.shipmentsId } });
  const mongoUser = await UserCollection.find({ _id: user?.mongoId });
  const userCountry = mongoUser[0]?.address.country;

  if (user?.mongoId === '6692c0d7888a7f31998c180e') {
    const res = await ShipmentsCollection.deleteMany({ _id: { $in: body.shipmentsId } });
    return res;
  }
  for (const shipment of shipments as unknown as IShipments[]) {
    if (userCountry === Countries.LIBYA && isRestrictedForLibya(shipment)) {
      throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
    }
    if (!checkAdminResponsibility(userCountry as Countries, shipment.status)) {
      throw new CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
    }
  }
  try {
    const res = await ShipmentsCollection.deleteMany({ _id: { $in: body.shipmentsId } });
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
    config?.libyanExchangeRate, // current lyd compared to usd
    config?.seaShippingPrice, //sea shipping cost per kg in LYD
    config?.shippingCost, //air shipping cost per kg in USD
    config?.shippingFactorSea,
    config?.shippingFactor
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
  updateShipmentsEsn,
  deleteShipment,
  getShipmentsUnpaginated,
  calculateShippingPrice,
};
