import { connectDB } from '../../config/db.js';
import { Admin } from '../../models/index.js';
import { escapeRegex } from '../../lib/search.js';

export const authDal = {
  async findMany(search = '') {
    await connectDB();
    const escapedSearch = escapeRegex(search.trim());
    const filter = escapedSearch
      ? {
          $or: [
            { name: { $regex: escapedSearch, $options: 'i' } },
            { email: { $regex: escapedSearch, $options: 'i' } },
          ],
        }
      : {};
    return Admin.find(filter)
      .select('name email phone role is_active createdAt')
      .sort({ createdAt: -1 });
  },

  async findByEmail(email) {
    await connectDB();
    return Admin.findOne({ email });
  },

  async findActiveEmails() {
    await connectDB();
    return Admin.find({ is_active: true }).select('email');
  },

  async findById(id) {
    await connectDB();
    return Admin.findById(id);
  },

  async findByResetToken(token) {
    await connectDB();
    return Admin.findOne({ resetToken: token, resetTokenExp: { $gte: new Date() } });
  },

  async create(data) {
    await connectDB();
    return Admin.create(data);
  },

  async update(id, data) {
    await connectDB();
    return Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    await connectDB();
    return Admin.findByIdAndDelete(id);
  },
};
