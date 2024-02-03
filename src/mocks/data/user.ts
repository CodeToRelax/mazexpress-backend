import { IUserUpdate, IUser } from '@/utils/types';
import { faker } from '@faker-js/faker';

export const mockUserAdmin: IUser = {
  username: faker.internet.userName(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  birthDate: faker.date.birthdate(),
  adress: {
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
  username: faker.internet.userName(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  birthDate: faker.date.birthdate(),
  adress: {
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
  birthDate: faker.date.birthdate(),
  adress: {
    city: faker.location.city(),
    street: faker.location.street(),
    specificDescription: faker.location.direction(),
  },
  phoneNumber: '0928930737',
};
