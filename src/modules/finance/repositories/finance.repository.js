import FinanceOfficer from "../models/FinanceOfficerSchema.js";

class FinanceRepository {
  async findAll(query = {}) {
    return await FinanceOfficer.find(query).populate("user");
  }

  async findById(id) {
    return await FinanceOfficer.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await FinanceOfficer.findOne({ user: userId });
  }

  async create(data) {
    return await FinanceOfficer.create(data);
  }

  async update(id, data) {
    return await FinanceOfficer.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await FinanceOfficer.findByIdAndDelete(id);
  }
}

export default new FinanceRepository();
