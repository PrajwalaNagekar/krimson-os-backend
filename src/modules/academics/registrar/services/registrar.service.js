import registrarRepository from "../repositories/registrar.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class RegistrarService {
  async getAllRegistrars(query) {
    return await registrarRepository.findAll(query);
  }

  async getRegistrarById(id) {
    const registrar = await registrarRepository.findById(id);
    if (!registrar) {
      throw new AppError("Registrar not found", HTTP_STATUS.NOT_FOUND);
    }
    return registrar;
  }

  async createRegistrar(data) {
    if (data.user) {
      const existingRegistrar = await registrarRepository.findByUserId(
        data.user
      );
      if (existingRegistrar) {
        throw new AppError(
          "Registrar profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await registrarRepository.create(data);
  }

  async updateRegistrar(id, data) {
    const registrar = await registrarRepository.update(id, data);
    if (!registrar) {
      throw new AppError("Registrar not found", HTTP_STATUS.NOT_FOUND);
    }
    return registrar;
  }

  async deleteRegistrar(id) {
    const registrar = await registrarRepository.delete(id);
    if (!registrar) {
      throw new AppError("Registrar not found", HTTP_STATUS.NOT_FOUND);
    }
    return registrar;
  }
}

export default new RegistrarService();
