import teacherRepository from "../repositories/teacher.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class TeacherService {
  async getAllTeachers(query) {
    return await teacherRepository.findAll(query);
  }

  async getTeacherById(id) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new AppError("Teacher not found", HTTP_STATUS.NOT_FOUND);
    }
    return teacher;
  }

  async createTeacher(data) {
    const existingTeacher = await teacherRepository.findByEmployeeId(
      data.employee_id
    );
    if (existingTeacher) {
      throw new AppError(
        "Teacher with this employee ID already exists",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    return await teacherRepository.create(data);
  }

  async updateTeacher(id, data) {
    const teacher = await teacherRepository.update(id, data);
    if (!teacher) {
      throw new AppError("Teacher not found", HTTP_STATUS.NOT_FOUND);
    }
    return teacher;
  }

  async deleteTeacher(id) {
    const teacher = await teacherRepository.delete(id);
    if (!teacher) {
      throw new AppError("Teacher not found", HTTP_STATUS.NOT_FOUND);
    }
    return teacher;
  }
}

export default new TeacherService();
