import Teacher from "../models/TeacherSchema.js";

class TeacherRepository {
  async findAll(query = {}) {
    return await Teacher.find(query)
      .populate("user")
      .populate("teaching_assignments.class_section");
  }

  async findById(id) {
    return await Teacher.findById(id)
      .populate("user")
      .populate("teaching_assignments.class_section");
  }

  async findByEmployeeId(employeeId) {
    return await Teacher.findOne({ employee_id: employeeId });
  }

  async create(data) {
    return await Teacher.create(data);
  }

  async update(id, data) {
    return await Teacher.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Teacher.findByIdAndDelete(id);
  }
}

export default new TeacherRepository();
