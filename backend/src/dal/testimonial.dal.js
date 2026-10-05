import { Testimonial } from '../models/index.js';

class TestimonialDal {
  async create(data) {
    const testimonial = new Testimonial(data);
    return testimonial.save();
  }

  async findAll(query = {}) {
    return Testimonial.find(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Testimonial.findById(id);
  }

  async update(id, data) {
    return Testimonial.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Testimonial.findByIdAndDelete(id);
  }
}

export default new TestimonialDal();
