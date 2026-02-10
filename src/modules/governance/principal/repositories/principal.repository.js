import Principal from "../models/PrincipalSchema.js";

class PrincipalRepository {
  async findAll(query = {}) {
    return await Principal.find(query).populate("user");
  }

  async findById(id) {
    return await Principal.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await Principal.findOne({ user: userId });
  }

  async create(data) {
    return await Principal.create(data);
  }

  async update(id, data) {
    return await Principal.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Principal.findByIdAndDelete(id);
  }
}

export default new PrincipalRepository();
