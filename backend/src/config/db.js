import mongoose from 'mongoose';
import * as models from '../models/index.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing');
  await mongoose.connect(process.env.DATABASE_URL);
  isConnected = true;
}

// Convert Prisma syntax to Mongoose queries
function buildMongoQuery(where) {
  if (!where) return {};
  const query = {};
  for (let [key, val] of Object.entries(where)) {
    if (key === 'OR') {
      query.$or = val.map(buildMongoQuery);
    } else if (key === 'AND') {
      query.$and = val.map(buildMongoQuery);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      query[key] = {};
      if (val.contains !== undefined) query[key].$regex = new RegExp(val.contains, val.mode === 'insensitive' ? 'i' : '');
      if (val.gt !== undefined) query[key].$gt = val.gt;
      if (val.gte !== undefined) query[key].$gte = val.gte;
      if (val.lt !== undefined) query[key].$lt = val.lt;
      if (val.lte !== undefined) query[key].$lte = val.lte;
      if (val.not !== undefined) query[key].$ne = val.not;
      if (val.in) query[key].$in = val.in;
    } else {
      if (key === 'id') query._id = val;
      else query[key] = val;
    }
  }
  return query;
}

function mapDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  // Map populated arrays/objects recursively
  for (let key in obj) {
      if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(i => i && !(i instanceof mongoose.Types.ObjectId) && i._id ? mapDoc(i) : i);
    } else if (obj[key] && !(obj[key] instanceof mongoose.Types.ObjectId) && obj[key]._id) {
          obj[key] = mapDoc(obj[key]);
      }
  }
  return obj;
}

function applyIncludes(query, include) {
  if (!include) return query;
  for (let [key, val] of Object.entries(include)) {
    if (val) {
      if (typeof val === 'object' && val.include) {
         // handle nested includes (very basic implementation)
         let populateOptions = { path: key };
         const nestedPopulates = [];
         for(let nestedKey of Object.keys(val.include)) {
             if(val.include[nestedKey]) {
                 nestedPopulates.push({ path: nestedKey });
             }
         }
         populateOptions.populate = nestedPopulates;
         query = query.populate(populateOptions);
      } else {
         query = query.populate(key);
      }
    }
  }
  return query;
}

function applyOrderBy(query, orderBy) {
  if (!orderBy) return query;
  let sort = {};
  if (Array.isArray(orderBy)) {
     orderBy.forEach(ob => {
       for (let [key, val] of Object.entries(ob)) sort[key] = val === 'desc' ? -1 : 1;
     });
  } else {
    for (let [key, val] of Object.entries(orderBy)) sort[key] = val === 'desc' ? -1 : 1;
  }
  return query.sort(sort);
}

function applySelect(query, select) {
  if (!select) return query;
  const projection = {};
  for (let [key, val] of Object.entries(select)) {
    if (val === true) projection[key] = 1;
    else if (val === false) projection[key] = 0;
  }
  // Mongoose automatically includes _id, mapDoc maps it to id.
  return query.select(projection);
}

function createModelWrapper(Model) {
  return {
    findMany: async (args = {}) => {
      await connectDB();
      let query = Model.find(buildMongoQuery(args.where));
      query = applyIncludes(query, args.include);
      query = applySelect(query, args.select);
      query = applyOrderBy(query, args.orderBy);
      if (args.skip) query = query.skip(args.skip);
      if (args.take) query = query.limit(args.take);
      const docs = await query.exec();
      return docs.map(mapDoc);
    },
    findFirst: async (args = {}) => {
      await connectDB();
      let query = Model.findOne(buildMongoQuery(args.where));
      query = applyIncludes(query, args.include);
      query = applySelect(query, args.select);
      query = applyOrderBy(query, args.orderBy);
      const doc = await query.exec();
      return mapDoc(doc);
    },
    findUnique: async (args = {}) => {
      await connectDB();
      let query = Model.findOne(buildMongoQuery(args.where));
      query = applyIncludes(query, args.include);
      query = applySelect(query, args.select);
      const doc = await query.exec();
      return mapDoc(doc);
    },
    create: async (args = {}) => {
      await connectDB();
      // Handle nested creates loosely or assume standard flat inserts
      let data = { ...args.data };
      const doc = await Model.create(data);
      let query = Model.findById(doc._id);
      query = applyIncludes(query, args.include);
      query = applySelect(query, args.select);
      const populated = await query.exec();
      return mapDoc(populated);
    },
    update: async (args = {}) => {
      await connectDB();
      const doc = await Model.findOneAndUpdate(buildMongoQuery(args.where), args.data, { new: true });
      let query = Model.findById(doc._id);
      query = applyIncludes(query, args.include);
      query = applySelect(query, args.select);
      const populated = await query.exec();
      return mapDoc(populated);
    },
    updateMany: async (args = {}) => {
      await connectDB();
      const res = await Model.updateMany(buildMongoQuery(args.where), args.data);
      return { count: res.modifiedCount };
    },
    delete: async (args = {}) => {
      await connectDB();
      const doc = await Model.findOneAndDelete(buildMongoQuery(args.where));
      return mapDoc(doc);
    },
    deleteMany: async (args = {}) => {
      await connectDB();
      const res = await Model.deleteMany(buildMongoQuery(args.where));
      return { count: res.deletedCount };
    },
    count: async (args = {}) => {
      await connectDB();
      return await Model.countDocuments(buildMongoQuery(args.where));
    },
    aggregate: async (args = {}) => {
        // Very rudimentary mock for aggregate sums
        await connectDB();
        let match = buildMongoQuery(args.where);
        const sums = {};
        if (args._sum) {
            const docs = await Model.find(match);
            for(let key of Object.keys(args._sum)) {
                sums[key] = docs.reduce((acc, doc) => acc + (doc[key] || 0), 0);
            }
          const count = args._count ? docs.length : undefined;
          return {
            _sum: sums,
            ...(count === undefined ? {} : { _count: { id: count } })
          };
        }
        return { _sum: sums, _count: {} };
      },
      groupBy: async (args = {}) => {
        await connectDB();
        const docs = await Model.find(buildMongoQuery(args.where)).exec();
        const groups = new Map();

        for (const doc of docs) {
          const keyValues = {};
          for (const field of args.by || []) {
            const value = doc[field];
            keyValues[field] = value && value.toString ? value.toString() : value;
          }

          const groupKey = JSON.stringify(keyValues);
          if (!groups.has(groupKey)) {
            groups.set(groupKey, {
              ...keyValues,
              _sum: {},
              _count: {}
            });
          }

          const group = groups.get(groupKey);
          for (const field of Object.keys(args._sum || {})) {
            group._sum[field] = (group._sum[field] || 0) + (Number(doc[field]) || 0);
          }
          for (const field of Object.keys(args._count || {})) {
            group._count[field] = (group._count[field] || 0) + 1;
          }
        }

        let result = [...groups.values()];
        const orderBy = args.orderBy?._sum;
        if (orderBy) {
          const [field, direction] = Object.entries(orderBy)[0];
          result.sort((left, right) => {
            const difference = (left._sum[field] || 0) - (right._sum[field] || 0);
            return direction === 'desc' ? -difference : difference;
          });
        }

        return args.take ? result.slice(0, args.take) : result;
    }
  };
}

const prisma = {
  admin: createModelWrapper(models.Admin),
  user: createModelWrapper(models.User),
  product: createModelWrapper(models.Product),
  stockBatch: createModelWrapper(models.StockBatch),
  provider: createModelWrapper(models.Provider),
  customer: createModelWrapper(models.Customer),
  purchase: createModelWrapper(models.Purchase),
  purchaseItem: createModelWrapper(models.PurchaseItem),
  sale: createModelWrapper(models.Sale),
  saleItem: createModelWrapper(models.SaleItem),
  systemSetting: createModelWrapper(models.SystemSetting) // renamed from SystemSetting for camelCase
};

export default prisma;
