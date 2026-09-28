import { connectDB } from '../../config/db.js';
import { User } from '../../models/index.js';

export const authDal = {
  async findByEmail(email) {
    await connectDB();
    return User.findOne({ email });
  },

  async findById(id) {
    await connectDB();
    return User.findById(id);
  },

  async create(data) {
    await connectDB();
    return User.create(data);
  },

  async update(id, data) {
    await connectDB();
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async findByEmailAndOtp(email, otp) {
    await connectDB();
    return User.findOne({ email, otp, otpExpiresAt: { $gt: new Date() } });
  },
};
