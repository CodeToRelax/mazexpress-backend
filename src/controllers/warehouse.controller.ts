//*OK*

import { CustomErrorHandler } from '@/middlewares/error.middleware';
import WarehouseCollection from '@/models/warehouse.model';
import { IWarehouse, StatusCode } from '@/utils/types';

const getWarehouses = async () => {
  try {
    const warehouses = await WarehouseCollection.find({});
    return warehouses;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.getWarehouseError',
      'errorMessageTemp',
      error
    );
  }
};

const createWarehouse = async (body: IWarehouse) => {
  try {
    const warehouseInstance = new WarehouseCollection(body);
    const newWarehouse = await warehouseInstance.save();
    return newWarehouse;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.createWarehouseError',
      'errorMessageTemp',
      error
    );
  }
};

const updateWarehouse = async (_id: string, body: IWarehouse) => {
  try {
    const res = await WarehouseCollection.findOneAndUpdate({ _id }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.warehouseUpdateError',
      'errorMessageTemp',
      error
    );
  }
};

const deleteWarehouse = async (_id: string) => {
  try {
    const res = await WarehouseCollection.findByIdAndDelete(_id);
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.warehouseUpdateError',
      'errorMessageTemp',
      error
    );
  }
};

export const WarehouseController = {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
