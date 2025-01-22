import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ConfigCollection from '@/models/config.model';
import { ISystemConfig } from '@/utils/types';

const getShippingConfig = async () => {
  try {
    const res = await ConfigCollection.findById('65db6c55d3a4d41e6ac96432');
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
  }
};

const updateShippingConfig = async (body: ISystemConfig) => {
  try {
    console.log(body);
    const res = await ConfigCollection.findOneAndUpdate({ _id: '65db6c55d3a4d41e6ac96432' }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
  }
};

export const ConfigController = {
  getShippingConfig,
  updateShippingConfig,
};
