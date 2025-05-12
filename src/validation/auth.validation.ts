// *OK*

import { Cities, Countries, Gender, ToggleState, UserTypes } from '@/utils/types';
import joi from 'joi';

export const createUserValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
  password: joi.string().min(3).required(),
  birthdate: joi.string().allow('').lowercase(),
  address: joi.object({
    street: joi.string().required(),
    city: joi
      .string()
      .valid(...Object.values(Cities))
      .required(),
    specificDescription: joi.string().optional(),
    country: joi
      .string()
      .valid(...Object.values(Countries))
      .required(),
  }),
  gender: joi
    .string()
    .valid(...Object.values(Gender))
    .required(),
  email: joi.string().email().allow('').lowercase(),
  phoneNumber: joi.string().required(),
  privacyPolicy: joi.object({
    usageAgreement: joi.boolean().required(),
  }),
  userType: joi
    .string()
    .valid(...Object.values(UserTypes))
    .optional(),
});

export const toggleUserValidation = joi.object({
  firebaseId: joi.string().required(),
  status: joi
    .string()
    .valid(...Object.values(ToggleState))
    .required(),
});

export const updateAclValidation = joi.object({
  userId: joi.string().required(),
  rules: joi
    .object({
      DELETE: joi.object().pattern(joi.string(), joi.any()),
      POST: joi.object().pattern(joi.string(), joi.any()),
      PATCH: joi.object().pattern(joi.string(), joi.any()),
      GET: joi.object().pattern(joi.string(), joi.any()),
      UPDATE: joi.object().pattern(joi.string(), joi.any()),
    })
    .required(),
});
