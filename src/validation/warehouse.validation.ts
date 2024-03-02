import joi from 'joi';

export const createWarehouseValidation = joi.object({
  name: joi.string().lowercase().min(3).required(),
  address: joi.object({
    doorNumber: joi.string().required(),
    buildingNumber: joi.string().required(),
    street: joi.string().required(),
    neighborhood: joi.string().required(),
    district: joi.string().required(),
    city: joi.string().valid('benghazi', 'tripoli', 'musrata', 'istanbul').required(),
    country: joi.string().valid('libya', 'turkey').required(),
    googleMapsUrl: joi.string().required(),
  }),
  phoneNumber: joi.string().required(),
  email: joi.string().email().allow('').lowercase(),
  youtubeUrl: joi.string().allow('').lowercase(),
});
