import { IUserUpdate, IUser } from '@/utils/types';

export const mockUser: IUser = {
  username: 'random',
  firstName: 'John',
  lastName: 'Doe',
  password: 'securePassword123',
  birthDate: new Date('1990-05-15T00:00:00.000Z'),
  adress: {
    city: 'benghazi',
    street: 'elhadayek street',
    specificDescription: 'nothing',
  },
  email: 'john.doe@example.com',
  phoneNumber: '0928930736',
  privacyPolicy: {
    dataPrivacy: true,
    usageAgreement: true,
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

export const mockUserUpdate: IUserUpdate = {
  firstName: 'John monir',
  lastName: 'Doesss',
  birthDate: new Date('1990-05-15T00:00:00.000Z'),
  adress: {
    city: 'benghazi',
    street: 'elhadayek street',
    specificDescription: 'nothing',
  },
  phoneNumber: '0928930736',
};
