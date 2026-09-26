import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, default: 'ADMIN' },
  is_active: { type: Boolean, default: true },
  resetToken: String,
  resetTokenExp: Date
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  emailVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiresAt: Date,
  resetToken: String,
  resetTokenExp: Date,
  role: { type: String, default: 'USER' },
  is_active: { type: Boolean, default: true },
  state: String,
  district: String,
  verificationStatus: { type: String, default: 'NOT_SUBMITTED' },
  verificationProofUrl: String,
  rejectionReason: String,
  reviewedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  verifiedAt: Date
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  currentStock: { type: Number, default: 0 },
  baseCostPrice: { type: Number, default: 0 },
  baseSalePrice: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const StockBatchSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchasePrice: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { timestamps: true });

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const PurchaseSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 }
}, { timestamps: true });

const PurchaseItemSchema = new mongoose.Schema({
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

const SaleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 }
}, { timestamps: true });

const SaleItemSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'StockBatch' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  profit: { type: Number, required: true }
}, { timestamps: true });

const SystemSettingSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  traderSelfRegistration: { type: Boolean, default: true },
  notifyOnNewTrader: { type: Boolean, default: true }
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const StockBatch = mongoose.models.StockBatch || mongoose.model('StockBatch', StockBatchSchema);
export const Provider = mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
export const PurchaseItem = mongoose.models.PurchaseItem || mongoose.model('PurchaseItem', PurchaseItemSchema);
export const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
export const SaleItem = mongoose.models.SaleItem || mongoose.model('SaleItem', SaleItemSchema);
export const SystemSetting = mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);
