import { connectDB } from '../../config/db.js';
import { Admin } from '../../models/index.js';

const profileFields = 'name email phone role is_active createdAt';

export const profileDal = {
  async findById(id) {
    await connectDB();
    return Admin.findById(id).select(profileFields);
  },

  async update(id, data) {
    await connectDB();
    return Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
};
