import { testimonialDal } from '../dal/testimonialDal.js';

class TestimonialService {
  async createTestimonial(data) {
    return testimonialDal.create(data);
  }

  async getAllTestimonials(query = {}) {
    return testimonialDal.findAll(query);
  }

  async getApprovedTestimonials() {
    return testimonialDal.findAll({ status: 'APPROVED' });
  }

  async updateTestimonialStatus(id, status) {
    const testimonial = await testimonialDal.findById(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    return testimonialDal.update(id, { status });
  }

  async updateTestimonial(id, data) {
    const testimonial = await testimonialDal.findById(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    return testimonialDal.update(id, data);
  }

  async deleteTestimonial(id) {
    const testimonial = await testimonialDal.findById(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    return testimonialDal.delete(id);
  }
}

export const testimonialService = new TestimonialService();
