import { providerDal } from '../../dal/userDal/providerDal.js';
import { escapeRegex } from '../../lib/search.js';

export const providerService = {
  async getProviders(userId, search = '', page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const escapedSearch = escapeRegex(search.trim());
    const where = {
      userId,
      ...(escapedSearch && {
        $or: [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { phone: { $regex: escapedSearch } },
        ],
      }),
    };

    const [providers, total] = await Promise.all([
      providerDal.findMany(where, skip, limit),
      providerDal.count(where),
    ]);

    return {
      providers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getProviderById(id, userId) {
    const provider = await providerDal.findByIdWithPurchases(id, userId);
    if (!provider) throw new Error('Provider not found');
    return provider;
  },

  async createProvider(userId, data) {
    const { name, phone, address } = data;
    if (!name) throw new Error('Name is required');
    return await providerDal.create({
      name,
      phone: phone || null,
      address: address || null,
      userId,
    });
  },

  async updateProvider(id, userId, data) {
    const { name, phone, address } = data;
    return await providerDal.update(id, userId, {
      ...(name != null && { name }),
      ...(phone != null && { phone }),
      ...(address != null && { address }),
    });
  },

  async deleteProvider(id, userId) {
    return await providerDal.delete(id, userId);
  },
};
