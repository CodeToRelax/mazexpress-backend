import joi from 'joi';

export const createShipmentValidation = joi.object({
  isn: joi.string().lowercase(),
  csn: joi.string().lowercase().required(),
  size: joi.object({
    weight: joi.number(),
    height: joi.number(),
    width: joi.number(),
    length: joi.number(),
  }),
  shipmentDestination: joi.string().valid('benghazi', 'tripoli', 'musrata').required(),
  shippingMethod: joi.string().valid('air', 'sea').required(),
  extraCosts: joi.number(),
  note: joi.string(),
  status: joi
    .string()
    .valid(
      'recieved at warehouse',
      'shipped to destination',
      'on hold',
      'at sorting facility',
      'ready for pick up',
      'delivered'
    )
    .required(),
});

export const updateShipmentValidation = joi.object({
  isn: joi.string().lowercase(),
  csn: joi.string().lowercase().required(),
  size: joi.object({
    weight: joi.number().required(),
    height: joi.number().required(),
    width: joi.number().required(),
    length: joi.number().required(),
  }),
  shipmentDestination: joi.string().valid('benghazi', 'tripoli', 'musrata').required(),
  shippingMethod: joi.string().valid('air', 'sea').required(),
  extraCosts: joi.number(),
  note: joi.string(),
  status: joi
    .string()
    .valid(
      'recieved at warehouse',
      'shipped to destination',
      'on hold',
      'at sorting facility',
      'ready for pick up',
      'delivered'
    )
    .required(),
});

export const updateShipmentsValidation = joi.object({
  shipmentsId: joi.array().items(joi.string()).required(),
  shipmentStatus: joi
    .string()
    .valid(
      'recieved at warehouse',
      'shipped to destination',
      'on hold',
      'at sorting facility',
      'ready for pick up',
      'delivered'
    )
    .required(),
});
