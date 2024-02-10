import joi from 'joi';

export const UpdateProfileValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
  birthdate: joi.string().allow('').lowercase(),
});
