import principalRepository from "../repositories/principal.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class PrincipalService {
  async getAllPrincipals(query) {
    return await principalRepository.findAll(query);
  }

  async getPrincipalById(id) {
    const principal = await principalRepository.findById(id);
    if (!principal) {
      throw new AppError("Principal not found", HTTP_STATUS.NOT_FOUND);
    }
    return principal;
  }

  async createPrincipal(data) {
    if (data.user) {
      const existingPrincipal = await principalRepository.findByUserId(
        data.user
      );
      if (existingPrincipal) {
        throw new AppError(
          "Principal profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await principalRepository.create(data);
  }

  async updatePrincipal(id, data) {
    const principal = await principalRepository.update(id, data);
    if (!principal) {
      throw new AppError("Principal not found", HTTP_STATUS.NOT_FOUND);
    }
    return principal;
  }

  async deletePrincipal(id) {
    const principal = await principalRepository.delete(id);
    if (!principal) {
      throw new AppError("Principal not found", HTTP_STATUS.NOT_FOUND);
    }
    return principal;
  }
}

export default new PrincipalService();
