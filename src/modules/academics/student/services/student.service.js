import studentRepository from "../repositories/student.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class StudentService {
  async getAllStudents(query) {
    return await studentRepository.findAll(query);
  }

  async getStudentById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new AppError("Student not found", HTTP_STATUS.NOT_FOUND);
    }
    return student;
  }

  async createStudent(data) {
    const existingStudent = await studentRepository.findByAdmissionNumber(
      data.admission_number
    );
    if (existingStudent) {
      throw new AppError(
        "Student with this admission number already exists",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    return await studentRepository.create(data);
  }

  async updateStudent(id, data) {
    const student = await studentRepository.update(id, data);
    if (!student) {
      throw new AppError("Student not found", HTTP_STATUS.NOT_FOUND);
    }
    return student;
  }

  async deleteStudent(id) {
    const student = await studentRepository.delete(id);
    if (!student) {
      throw new AppError("Student not found", HTTP_STATUS.NOT_FOUND);
    }
    return student;
  }
}

export default new StudentService();
