import Management from "../models/ManagementSchema.js";

class ManagementRepository {
  async findAll(query = {}) {
    return await Management.find(query).populate("user");
  }

  async findById(id) {
    return await Management.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await Management.findOne({ user: userId });
  }

  async create(data) {
    return await Management.create(data);
  }

  async update(id, data) {
    return await Management.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Management.findByIdAndDelete(id);
  }
}

export default new ManagementRepository();
