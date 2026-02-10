import coordinatorRepository from "../repositories/coordinator.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class CoordinatorService {
  async getAllCoordinators(query) {
    return await coordinatorRepository.findAll(query);
  }

  async getCoordinatorById(id) {
    const coordinator = await coordinatorRepository.findById(id);
    if (!coordinator) {
      throw new AppError(
        "Academic Coordinator not found",
        HTTP_STATUS.NOT_FOUND
      );
    }
    return coordinator;
  }

  async createCoordinator(data) {
    if (data.user) {
      const existingCoordinator = await coordinatorRepository.findByUserId(
        data.user
      );
      if (existingCoordinator) {
        throw new AppError(
          "Coordinator profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await coordinatorRepository.create(data);
  }

  async updateCoordinator(id, data) {
    const coordinator = await coordinatorRepository.update(id, data);
    if (!coordinator) {
      throw new AppError(
        "Academic Coordinator not found",
        HTTP_STATUS.NOT_FOUND
      );
    }
    return coordinator;
  }

  async deleteCoordinator(id) {
    const coordinator = await coordinatorRepository.delete(id);
    if (!coordinator) {
      throw new AppError(
        "Academic Coordinator not found",
        HTTP_STATUS.NOT_FOUND
      );
    }
    return coordinator;
  }
}

export default new CoordinatorService();
