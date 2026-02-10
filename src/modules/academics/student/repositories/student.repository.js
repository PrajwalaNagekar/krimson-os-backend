import Student from "../models/StudentSchema.js";

class StudentRepository {
  async findAll(query = {}) {
    return await Student.find(query)
      .populate("user")
      .populate("current_class_section");
  }

  async findById(id) {
    return await Student.findById(id)
      .populate("user")
      .populate("current_class_section");
  }

  async findByAdmissionNumber(admissionNumber) {
    return await Student.findOne({ admission_number: admissionNumber });
  }

  async create(data) {
    return await Student.create(data);
  }

  async update(id, data) {
    return await Student.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Student.findByIdAndDelete(id);
  }
}

export default new StudentRepository();
