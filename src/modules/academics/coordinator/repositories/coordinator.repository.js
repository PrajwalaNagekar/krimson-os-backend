import AcademicCoordinator from "../models/AcademicCoordinatorSchema.js";

class CoordinatorRepository {
  async findAll(query = {}) {
    return await AcademicCoordinator.find(query).populate("user");
  }

  async findById(id) {
    return await AcademicCoordinator.findById(id)
      .populate("user")
      .populate("delegated_coordinators.user");
  }

  async findByUserId(userId) {
    return await AcademicCoordinator.findOne({ user: userId });
  }

  async create(data) {
    return await AcademicCoordinator.create(data);
  }

  async update(id, data) {
    return await AcademicCoordinator.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await AcademicCoordinator.findByIdAndDelete(id);
  }
}

export default new CoordinatorRepository();
