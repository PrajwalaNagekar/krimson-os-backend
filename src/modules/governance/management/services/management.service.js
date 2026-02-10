import managementRepository from "../repositories/management.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class ManagementService {
  async getAllManagementMembers(query) {
    return await managementRepository.findAll(query);
  }

  async getManagementMemberById(id) {
    const member = await managementRepository.findById(id);
    if (!member) {
      throw new AppError("Management member not found", HTTP_STATUS.NOT_FOUND);
    }
    return member;
  }

  async createManagementMember(data) {
    if (data.user) {
      const existingMember = await managementRepository.findByUserId(data.user);
      if (existingMember) {
        throw new AppError(
          "Management member profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await managementRepository.create(data);
  }

  async updateManagementMember(id, data) {
    const member = await managementRepository.update(id, data);
    if (!member) {
      throw new AppError("Management member not found", HTTP_STATUS.NOT_FOUND);
    }
    return member;
  }

  async deleteManagementMember(id) {
    const member = await managementRepository.delete(id);
    if (!member) {
      throw new AppError("Management member not found", HTTP_STATUS.NOT_FOUND);
    }
    return member;
  }
}

export default new ManagementService();
