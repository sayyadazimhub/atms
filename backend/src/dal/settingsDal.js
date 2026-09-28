import { connectDB } from '../config/db.js';
import { Admin, SystemSetting, User } from '../models/index.js';

const defaultSettings = {
  maintenanceMode: false,
  traderSelfRegistration: true,
  notifyOnNewTrader: true,
};

export const settingsDal = {
  async find() {
    await connectDB();
    return SystemSetting.findOne();
  },

  async create(data = defaultSettings) {
    await connectDB();
    return SystemSetting.create(data);
  },

  async save(data) {
    await connectDB();
    const current = await SystemSetting.findOne();
    if (!current) return SystemSetting.create({ ...defaultSettings, ...data });

    return SystemSetting.findByIdAndUpdate(current._id, data, {
      new: true,
      runValidators: true,
    });
  },

  async countActiveTraders() {
    await connectDB();
    return User.countDocuments({ role: 'USER', is_active: true });
  },

  async findActiveAdminEmails() {
    await connectDB();
    return Admin.find({ is_active: true }).select('email');
  },
};
