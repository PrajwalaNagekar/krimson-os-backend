import Counselor from "../models/CounselorSchema.js";

class CounselorRepository {
  async findAll(query = {}) {
    return await Counselor.find(query).populate("user");
  }

  async findById(id) {
    return await Counselor.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await Counselor.findOne({ user: userId });
  }

  async create(data) {
    return await Counselor.create(data);
  }

  async update(id, data) {
    return await Counselor.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Counselor.findByIdAndDelete(id);
  }
}

export default new CounselorRepository();
