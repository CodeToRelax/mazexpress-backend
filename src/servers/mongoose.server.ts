import { ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

// create connection
const ConnectToMongoDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.log(error);
  }
};

// listen to connection error
mongoose.connection.on('error', (err) => {
  console.log(err);
});

// listen to any disconnection
mongoose.connection.on('disconnected', (err) => {
  console.log(err);
});

export default ConnectToMongoDB;
