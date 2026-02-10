import Admin from "../models/AdminSchema.js";

class AdminRepository {
  async findAll(query = {}) {
    return await Admin.find(query).populate("user");
  }

  async findById(id) {
    return await Admin.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await Admin.findOne({ user: userId });
  }

  async create(data) {
    return await Admin.create(data);
  }

  async update(id, data) {
    return await Admin.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Admin.findByIdAndDelete(id);
  }
}

export default new AdminRepository();
