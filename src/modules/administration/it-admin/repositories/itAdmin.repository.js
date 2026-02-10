import ITAdmin from "../models/ITAdminSchema.js";

class ITAdminRepository {
  async findAll(query = {}) {
    return await ITAdmin.find(query).populate("user");
  }

  async findById(id) {
    return await ITAdmin.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await ITAdmin.findOne({ user: userId });
  }

  async create(data) {
    return await ITAdmin.create(data);
  }

  async update(id, data) {
    return await ITAdmin.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await ITAdmin.findByIdAndDelete(id);
  }
}

export default new ITAdminRepository();
