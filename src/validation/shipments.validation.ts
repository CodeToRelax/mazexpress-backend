// *OK*

import { Cities, ShipmentStatus, ShippingMethod } from '@/utils/types';
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
  shipmentDestination: joi
    .string()
    .valid(...Object.values(Cities))
    .required(),
  shippingMethod: joi
    .string()
    .valid(...Object.values(ShippingMethod))
    .required(),
  extraCosts: joi.number(),
  note: joi.string(),
  status: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
  shipmentStatus: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
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
  shipmentDestination: joi
    .string()
    .valid(...Object.values(Cities))
    .required(),
  shippingMethod: joi
    .string()
    .valid(...Object.values(ShippingMethod))
    .required(),
  extraCosts: joi.number(),
  note: joi.string(),
  status: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
  shipmentStatus: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
});

export const updateShipmentsValidation = joi.object({
  shipmentsId: joi.array().items(joi.string()).required(),
  status: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
  shipmentStatus: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
});

export const updateShipmentsBarCodeValidation = joi.object({
  shipmentsEsn: joi.array().items(joi.string()).required(),
  status: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .required(),
  shipmentStatus: joi
    .string()
    .valid(...Object.values(ShipmentStatus))
    .insensitive()
    .optional(),
});

export const deleteShipmentsValidation = joi.object({
  shipmentsId: joi.array().items(joi.string()).required(),
});
