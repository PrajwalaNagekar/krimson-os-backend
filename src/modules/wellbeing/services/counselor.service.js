import counselorRepository from "../repositories/counselor.repository.js";
import { HTTP_STATUS } from "../../../utils/constants.js";
import AppError from "../../../core/errors/app.error.js";

class CounselorService {
  async getAllCounselors(query) {
    return await counselorRepository.findAll(query);
  }

  async getCounselorById(id) {
    const counselor = await counselorRepository.findById(id);
    if (!counselor) {
      throw new AppError("Counselor not found", HTTP_STATUS.NOT_FOUND);
    }
    return counselor;
  }

  async createCounselor(data) {
    if (data.user) {
      const existingCounselor = await counselorRepository.findByUserId(
        data.user
      );
      if (existingCounselor) {
        throw new AppError(
          "Counselor profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await counselorRepository.create(data);
  }

  async updateCounselor(id, data) {
    const counselor = await counselorRepository.update(id, data);
    if (!counselor) {
      throw new AppError("Counselor not found", HTTP_STATUS.NOT_FOUND);
    }
    return counselor;
  }

  async deleteCounselor(id) {
    const counselor = await counselorRepository.delete(id);
    if (!counselor) {
      throw new AppError("Counselor not found", HTTP_STATUS.NOT_FOUND);
    }
    return counselor;
  }
}

export default new CounselorService();
