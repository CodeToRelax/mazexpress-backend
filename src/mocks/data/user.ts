import { IUserUpdate, IUser } from '@/utils/types';
import { faker } from '@faker-js/faker';

export const mockUserAdmin: IUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  birthdate: '2024.03.04',
  address: {
    city: faker.location.city(),
    street: faker.location.street(),
    specificDescription: faker.location.direction(),
  },
  email: faker.internet.email(),
  phoneNumber: '0928930736',
  privacyPolicy: {
    usageAgreement: faker.datatype.boolean(),
  },
  userType: 'ADMIN',
  uniqueShippingNumber: 'BEN2019',
  acl: {
    get: {},
    post: {},
    update: {},
    delete: {},
  },
};

export const mockUserCustomer: IUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  birthdate: '2024.03.04',
  address: {
    city: faker.location.city(),
    street: faker.location.street(),
    specificDescription: faker.location.direction(),
  },
  email: faker.internet.email(),
  // email: 'zyzzxshembesh@gmail.com',
  phoneNumber: '0928930737',
  privacyPolicy: {
    usageAgreement: faker.datatype.boolean(),
  },
  userType: 'CUSTOMER',
  uniqueShippingNumber: 'BEN2020',
  acl: {
    get: {},
    post: {},
    update: {},
    delete: {},
  },
};

export const mockUserUpdate: IUserUpdate = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  birthdate: '2024.03.04',
  address: {
    city: faker.location.city(),
    street: faker.location.street(),
    specificDescription: faker.location.direction(),
  },
  phoneNumber: '0928930737',
};
