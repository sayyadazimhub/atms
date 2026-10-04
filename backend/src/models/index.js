import mongoose from 'mongoose';

function transformDocument(_document, result) {
  if (result._id) {
    result.id = result._id.toString();
    delete result._id;
  }
  delete result.__v;
  return result;
}

function createSchema(definition) {
  return new mongoose.Schema(definition, {
    timestamps: true,
    toJSON: { virtuals: true, transform: transformDocument },
    toObject: { virtuals: true, transform: transformDocument },
  });
}

const AdminSchema = createSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, default: 'ADMIN' },
  is_active: { type: Boolean, default: true },
  resetToken: String,
  resetTokenExp: Date,
});

const UserSchema = createSchema({
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
  verifiedAt: Date,
});

const ProductSchema = createSchema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  currentStock: { type: Number, default: 0 },
  baseCostPrice: { type: Number, default: 0 },
  baseSalePrice: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const StockBatchSchema = createSchema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchasePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const ProviderSchema = createSchema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const CustomerSchema = createSchema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const PurchaseSchema = createSchema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
});

const PurchaseItemSchema = createSchema({
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const SaleSchema = createSchema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
});

const SaleItemSchema = createSchema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'StockBatch' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  profit: { type: Number, required: true },
});

const SystemSettingSchema = createSchema({
  maintenanceMode: { type: Boolean, default: false },
  traderSelfRegistration: { type: Boolean, default: true },
  notifyOnNewTrader: { type: Boolean, default: true },
});

const ContactMessageSchema = createSchema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

ProductSchema.virtual('batches', {
  ref: 'StockBatch',
  localField: '_id',
  foreignField: 'productId',
});
ProductSchema.virtual('purchaseItems', {
  ref: 'PurchaseItem',
  localField: '_id',
  foreignField: 'productId',
});
ProviderSchema.virtual('purchases', {
  ref: 'Purchase',
  localField: '_id',
  foreignField: 'providerId',
});
CustomerSchema.virtual('sales', {
  ref: 'Sale',
  localField: '_id',
  foreignField: 'customerId',
});
PurchaseSchema.virtual('items', {
  ref: 'PurchaseItem',
  localField: '_id',
  foreignField: 'purchaseId',
});
SaleSchema.virtual('items', {
  ref: 'SaleItem',
  localField: '_id',
  foreignField: 'saleId',
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const StockBatch =
  mongoose.models.StockBatch || mongoose.model('StockBatch', StockBatchSchema);
export const Provider = mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
export const PurchaseItem =
  mongoose.models.PurchaseItem || mongoose.model('PurchaseItem', PurchaseItemSchema);
export const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
export const SaleItem = mongoose.models.SaleItem || mongoose.model('SaleItem', SaleItemSchema);
export const SystemSetting =
  mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
