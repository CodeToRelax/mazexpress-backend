import joi from 'joi';

export const signupValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
  password: joi.string().min(3).required(),
  confirmPassword: joi.ref('password'),
  birthdate: joi.string().allow('').lowercase(),
  address: joi.object({
    street: joi.string().required(),
    city: joi.string().required(),
    specificDescription: joi.string().optional(),
  }),
  email: joi.string().email().allow('').lowercase(),
  phoneNumber: joi.number().required(),
  privacyPolicy: joi.object({
    usageAgreement: joi.boolean().required(),
  }),
});
