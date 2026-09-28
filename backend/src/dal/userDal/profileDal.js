import { connectDB } from '../../config/db.js';
import { User } from '../../models/index.js';

const profileFields =
  'name email phone emailVerified is_active verificationStatus role createdAt updatedAt';

export const profileDal = {
  async findById(id) {
    await connectDB();
    return User.findById(id).select(profileFields);
  },

  async update(id, data) {
    await connectDB();
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      select: profileFields,
    });
  },
};
