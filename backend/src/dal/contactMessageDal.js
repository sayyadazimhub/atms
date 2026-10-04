import { connectDB } from '../config/db.js';
import { ContactMessage } from '../models/index.js';

export const contactMessageDal = {
  async findMany(query = {}) {
    await connectDB();
    return ContactMessage.find(query).sort({ createdAt: -1 });
  },

  async findById(id) {
    await connectDB();
    return ContactMessage.findById(id);
  },

  async create(data) {
    await connectDB();
    return ContactMessage.create(data);
  },

  async update(id, data) {
    await connectDB();
    return ContactMessage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    await connectDB();
    return ContactMessage.findByIdAndDelete(id);
  },
};
