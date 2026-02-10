import RoleSchema from "../models/RoleSchema.js";

/**
 * Role Repository - Data Access Layer
 */
class RoleRepository {
  async findByName(name) {
    return await RoleSchema.findOne({ name: name.toUpperCase() });
  }

  async findById(roleId) {
    return await RoleSchema.findById(roleId).populate("permissions");
  }

  async findAll() {
    return await RoleSchema.find().populate("permissions");
  }

  async create(roleData) {
    const role = new RoleSchema(roleData);
    return await role.save();
  }

  async update(roleId, updateData) {
    return await RoleSchema.findByIdAndUpdate(roleId, updateData, {
      new: true,
      runValidators: true,
    }).populate("permissions");
  }

  async delete(roleId) {
    return await RoleSchema.findByIdAndDelete(roleId);
  }
}

export default new RoleRepository();
