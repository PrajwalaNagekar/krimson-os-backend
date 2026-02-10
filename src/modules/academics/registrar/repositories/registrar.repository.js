import Registrar from "../models/RegistrarSchema.js";

class RegistrarRepository {
  async findAll(query = {}) {
    return await Registrar.find(query).populate("user");
  }

  async findById(id) {
    return await Registrar.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await Registrar.findOne({ user: userId });
  }

  async create(data) {
    return await Registrar.create(data);
  }

  async update(id, data) {
    return await Registrar.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Registrar.findByIdAndDelete(id);
  }
}

export default new RegistrarRepository();
