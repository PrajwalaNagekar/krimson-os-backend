import roleRepository from "../repositories/role.repository.js";
import { HTTP_STATUS } from "../../../utils/constants.js";
import AppError from "../../../core/errors/app.error.js";

/**
 * Role Service - Business Logic Layer
 */
class RoleService {
  async getAllRoles() {
    return await roleRepository.findAll();
  }

  async getRoleById(roleId) {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
    }
    return role;
  }

  async createRole(roleData) {
    const existingRole = await roleRepository.findByName(roleData.name);
    if (existingRole) {
      throw new AppError("Role already exists", HTTP_STATUS.BAD_REQUEST);
    }
    return await roleRepository.create(roleData);
  }

  async updateRole(roleId, updateData) {
    const role = await roleRepository.update(roleId, updateData);
    if (!role) {
      throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
    }
    return role;
  }

  async deleteRole(roleId) {
    const role = await roleRepository.delete(roleId);
    if (!role) {
      throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
    }
    return role;
  }
}

export default new RoleService();
