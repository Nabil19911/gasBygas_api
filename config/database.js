import { connect } from 'mongoose';
// import createAdmin from '../helper/createAdmin';

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    // await createAdmin();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
