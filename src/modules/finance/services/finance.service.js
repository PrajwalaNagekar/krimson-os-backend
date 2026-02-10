import financeRepository from "../repositories/finance.repository.js";
import { HTTP_STATUS } from "../../../utils/constants.js";
import AppError from "../../../core/errors/app.error.js";

class FinanceService {
  async getAllFinanceOfficers(query) {
    return await financeRepository.findAll(query);
  }

  async getFinanceOfficerById(id) {
    const officer = await financeRepository.findById(id);
    if (!officer) {
      throw new AppError("Finance Officer not found", HTTP_STATUS.NOT_FOUND);
    }
    return officer;
  }

  async createFinanceOfficer(data) {
    if (data.user) {
      const existingOfficer = await financeRepository.findByUserId(data.user);
      if (existingOfficer) {
        throw new AppError(
          "Finance Officer profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await financeRepository.create(data);
  }

  async updateFinanceOfficer(id, data) {
    const officer = await financeRepository.update(id, data);
    if (!officer) {
      throw new AppError("Finance Officer not found", HTTP_STATUS.NOT_FOUND);
    }
    return officer;
  }

  async deleteFinanceOfficer(id) {
    const officer = await financeRepository.delete(id);
    if (!officer) {
      throw new AppError("Finance Officer not found", HTTP_STATUS.NOT_FOUND);
    }
    return officer;
  }
}

export default new FinanceService();
