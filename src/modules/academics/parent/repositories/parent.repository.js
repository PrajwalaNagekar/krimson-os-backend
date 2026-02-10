import Parent from "../models/ParentSchema.js";

class ParentRepository {
  async findAll(query = {}) {
    return await Parent.find(query)
      .populate("user")
      .populate("children.student");
  }

  async findById(id) {
    return await Parent.findById(id)
      .populate("user")
      .populate("children.student");
  }

  async findByUserId(userId) {
    return await Parent.findOne({ user: userId });
  }

  async create(data) {
    return await Parent.create(data);
  }

  async update(id, data) {
    return await Parent.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Parent.findByIdAndDelete(id);
  }
}

export default new ParentRepository();
