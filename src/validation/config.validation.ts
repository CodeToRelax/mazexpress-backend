import joi from 'joi';

export const UpdateshippingConfigValidation = joi.object({
  shippingCost: joi.number().required(),
  shippingFactor: joi.number().required(),
  libyanExchangeRate: joi.number().required(),
  seaShippingPrice: joi.number().required(),
});
