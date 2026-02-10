import teacherService from "../services/teacher.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await teacherService.getAllTeachers(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: teacher,
      message: "Teacher created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.updateTeacher(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: teacher,
      message: "Teacher updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    await teacherService.deleteTeacher(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
