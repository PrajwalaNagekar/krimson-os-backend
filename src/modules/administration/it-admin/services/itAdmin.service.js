import itAdminRepository from "../repositories/itAdmin.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class ITAdminService {
  async getAllITAdmins(query) {
    return await itAdminRepository.findAll(query);
  }

  async getITAdminById(id) {
    const itAdmin = await itAdminRepository.findById(id);
    if (!itAdmin) {
      throw new AppError("IT Admin not found", HTTP_STATUS.NOT_FOUND);
    }
    return itAdmin;
  }

  async createITAdmin(data) {
    if (data.user) {
      const existingITAdmin = await itAdminRepository.findByUserId(data.user);
      if (existingITAdmin) {
        throw new AppError(
          "IT Admin profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await itAdminRepository.create(data);
  }

  async updateITAdmin(id, data) {
    const itAdmin = await itAdminRepository.update(id, data);
    if (!itAdmin) {
      throw new AppError("IT Admin not found", HTTP_STATUS.NOT_FOUND);
    }
    return itAdmin;
  }

  async deleteITAdmin(id) {
    const itAdmin = await itAdminRepository.delete(id);
    if (!itAdmin) {
      throw new AppError("IT Admin not found", HTTP_STATUS.NOT_FOUND);
    }
    return itAdmin;
  }
}

export default new ITAdminService();
