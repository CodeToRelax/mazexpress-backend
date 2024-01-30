// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.1.0',
});

const apiDoc = {
  info: {
    title: 'Mazexpress api',
    version: '1.0.0',
    description: '----',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  // components: {
  //   '@schemas': {
  //     createUser: {
  //       $username: { type: 'string' },
  //       $firstName: { type: 'string' },
  //       $lastName: { type: 'string' },
  //       $password: { type: 'string' },
  //       $birthDate: { type: Date },
  //       $adress: {
  //         type: 'object',
  //         street: { type: 'string' },
  //         city: { type: 'string' },
  //         specificDescription: { type: 'string' },
  //       },
  //       $email: { type: 'string' },
  //       $phoneNumber: { type: 'string' },
  //       $privacyPolicy: {
  //         type: 'object',
  //         usageAgreement: { type: 'boolean' },
  //         dataPrivacy: { type: 'boolean' },
  //       },
  //       $userType: { type: 'string' },
  //     },
  //   },
  // },
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.ts'];

swaggerAutogen(outputFile, routes, apiDoc);
