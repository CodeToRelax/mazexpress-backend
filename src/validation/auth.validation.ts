import joi from 'joi';

export const signupValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
  password: joi.string().min(3).required(),
  confirmPassword: joi.ref('password'),
  birthdate: joi.string().allow('').lowercase(),
  address: joi.object({
    street: joi.string().required(),
    city: joi.string().valid('benghazi', 'tripoli', 'musrata', 'istanbul').required(),
    specificDescription: joi.string().optional(),
    country: joi.string().valid('libya', 'turkey').required(),
  }),
  gender: joi.string().valid('male', 'female').required(),
  email: joi.string().email().allow('').lowercase(),
  phoneNumber: joi.string().required(),
  privacyPolicy: joi.object({
    usageAgreement: joi.boolean().required(),
  }),
});

export const createUserValidation = joi.object({
  firstName: joi.string().lowercase().min(3).required(),
  lastName: joi.string().lowercase().min(3).required(),
  password: joi.string().min(3).required(),
  confirmPassword: joi.ref('password'),
  birthdate: joi.string().allow('').lowercase(),
  address: joi.object({
    street: joi.string().required(),
    city: joi.string().valid('benghazi', 'tripoli', 'musrata', 'istanbul').required(),
    specificDescription: joi.string().optional(),
    country: joi.string().valid('libya', 'turkey').required(),
  }),
  gender: joi.string().valid('male', 'female').required(),
  email: joi.string().email().allow('').lowercase(),
  phoneNumber: joi.string().required(),
  privacyPolicy: joi.object({
    usageAgreement: joi.boolean().required(),
  }),
  userType: joi.string().valid('admin', 'customer').required(),
});

export const toggleUserValidation = joi.object({
  firebaseId: joi.string().required(),
  status: joi.string().valid('enable', 'disable').required(),
});
