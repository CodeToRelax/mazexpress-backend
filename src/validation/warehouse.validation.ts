// *OK*

import { Cities, Countries } from '@/utils/types';
import joi from 'joi';

export const createWarehouseValidation = joi.object({
  name: joi.string().lowercase().min(3).required(),
  address: joi.object({
    doorNumber: joi.string(),
    buildingNumber: joi.string(),
    street: joi.string(),
    neighborhood: joi.string(),
    district: joi.string(),
    city: joi
      .string()
      .valid(...Object.values(Cities))
      .required(),
    country: joi
      .string()
      .valid(...Object.values(Countries))
      .required(),
    googleMapsUrl: joi.string(),
  }),
  phoneNumber: joi.string().required(),
  email: joi.string().email().allow('').lowercase(),
  youtubeUrl: joi.string().allow('').lowercase(),
  imageUrl: joi.string().allow('').lowercase(),
});
