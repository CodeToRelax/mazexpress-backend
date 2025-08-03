// *OK*

import joi from 'joi';

export const UpdateProfileValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
});

export const AdminUpdateUserValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
  birthdate: joi.string().allow('').lowercase().optional(),
  address: joi.object({
    street: joi.string().required(),
    city: joi.string().required(),
    specificDescription: joi.string().allow('').optional(),
    country: joi.string().optional(),
  }),
  phoneNumber: joi.number().optional(),
  gender: joi.string().optional(),
  email: joi.string().optional(),
});

export const deleteUserValidation = joi.object({
  mongoId: joi.string().required(),
  firebaseId: joi.string().required(),
});
