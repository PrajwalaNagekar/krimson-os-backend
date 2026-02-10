import adminRepository from "../repositories/admin.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class AdminService {
  async getAllAdmins(query) {
    return await adminRepository.findAll(query);
  }

  async getAdminById(id) {
    const admin = await adminRepository.findById(id);
    if (!admin) {
      throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
    }
    return admin;
  }

  async createAdmin(data) {
    if (data.user) {
      const existingAdmin = await adminRepository.findByUserId(data.user);
      if (existingAdmin) {
        throw new AppError(
          "Admin profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await adminRepository.create(data);
  }

  async updateAdmin(id, data) {
    const admin = await adminRepository.update(id, data);
    if (!admin) {
      throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
    }
    return admin;
  }

  async deleteAdmin(id) {
    const admin = await adminRepository.delete(id);
    if (!admin) {
      throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
    }
    return admin;
  }
}

export default new AdminService();
