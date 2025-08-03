import { CustomErrorHandler } from '@/middlewares/error.middleware';
import ConfigCollection from '@/models/config.model';
import { ISystemConfig, StatusCode } from '@/utils/types';

const configId = '65db6c55d3a4d41e6ac96432';

const getShippingConfig = async () => {
  try {
    const res = await ConfigCollection.findById(configId);
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.configUpdateError',
      'errorMessageTemp',
      error
    );
  }
};

const updateShippingConfig = async (body: ISystemConfig) => {
  try {
    const res = await ConfigCollection.findOneAndUpdate({ _id: configId }, { ...body });
    return res;
  } catch (error) {
    throw new CustomErrorHandler(
      StatusCode.CLIENT_ERROR_BAD_REQUEST,
      'common.configUpdateError',
      'errorMessageTemp',
      error
    );
  }
};

export const ConfigController = {
  getShippingConfig,
  updateShippingConfig,
};
