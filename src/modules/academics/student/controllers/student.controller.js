import studentService from "../services/student.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: student,
      message: "Student created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: student,
      message: "Student updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
