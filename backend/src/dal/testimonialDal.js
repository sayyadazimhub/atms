import { connectDB } from '../config/db.js';
import { Testimonial } from '../models/index.js';

class TestimonialDal {
  async create(data) {
    await connectDB();
    const testimonial = new Testimonial(data);
    return testimonial.save();
  }

  async findAll(query = {}) {
    await connectDB();
    return Testimonial.find(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    await connectDB();
    return Testimonial.findById(id);
  }

  async update(id, data) {
    await connectDB();
    return Testimonial.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    await connectDB();
    return Testimonial.findByIdAndDelete(id);
  }
}

export const testimonialDal = new TestimonialDal();
