import { contactMessageDal } from '../dal/contactMessageDal.js';

export const contactMessageService = {
  async getMessages() {
    return await contactMessageDal.findMany();
  },

  async getMessage(id) {
    const msg = await contactMessageDal.findById(id);
    if (!msg) throw new Error('Message not found');
    return msg;
  },

  async createMessage(data) {
    return await contactMessageDal.create(data);
  },

  async updateStatus(id, isRead) {
    return await contactMessageDal.update(id, { isRead });
  },

  async deleteMessage(id) {
    return await contactMessageDal.delete(id);
  },
};
