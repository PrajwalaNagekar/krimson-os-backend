import parentRepository from "../repositories/parent.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class ParentService {
  async getAllParents(query) {
    return await parentRepository.findAll(query);
  }

  async getParentById(id) {
    const parent = await parentRepository.findById(id);
    if (!parent) {
      throw new AppError("Parent not found", HTTP_STATUS.NOT_FOUND);
    }
    return parent;
  }

  async createParent(data) {
    // Check if parent entry already exists for this user (if provided)
    if (data.user) {
      const existingParent = await parentRepository.findByUserId(data.user);
      if (existingParent) {
        throw new AppError(
          "Parent profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await parentRepository.create(data);
  }

  async updateParent(id, data) {
    const parent = await parentRepository.update(id, data);
    if (!parent) {
      throw new AppError("Parent not found", HTTP_STATUS.NOT_FOUND);
    }
    return parent;
  }

  async deleteParent(id) {
    const parent = await parentRepository.delete(id);
    if (!parent) {
      throw new AppError("Parent not found", HTTP_STATUS.NOT_FOUND);
    }
    return parent;
  }
}

export default new ParentService();
