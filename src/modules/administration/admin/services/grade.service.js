import { gradeRepository } from "../repositories/grade.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

/**
 * Grade Service
 *
 * Business logic layer for Grade operations.
 * Function-based pattern for consistency.
 * Handles validation, error handling, and orchestrates repository operations.
 */

/**
 * Create a new grade
 * @param {Object} data - Grade data (name, code, defaultCapacity, etc.)
 * @param {String} createdBy - ID of user creating the grade
 * @returns {Promise<Grade>}
 * @throws {AppError} If grade with same name or code already exists
 */
const createGrade = async (data, createdBy) => {
  // Add createdBy to the data
  const gradeData = {
    ...data,
    createdBy,
  };

  try {
    const grade = await gradeRepository.createGrade(gradeData);
    return grade;
  } catch (error) {
    // Handle duplicate name or code error
    if (error.code === 11000) {
      const field = error.keyPattern?.name ? "name" : "code";
      throw new AppError(
        `Grade with this ${field} already exists`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    throw error;
  }
};

/**
 * Get all grades with pagination and filters
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @param {Object} filters - Filter criteria (search, status, academicYearId)
 * @returns {Promise<Object>} - Paginated grades with metadata
 */
const getAllGrades = async (page = 1, limit = 10, filters = {}) => {
  // Get grades from repository with pagination
  const { grades, total } = await gradeRepository.getAllGrades(
    filters,
    page,
    limit,
  );

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return {
    grades,
    total,
    page,
    limit,
    totalPages,
  };
};

/**
 * Get grade by ID
 * @param {String} id - Grade ID
 * @returns {Promise<Grade>}
 * @throws {AppError} If grade not found
 */
const getGradeById = async (id) => {
  const grade = await gradeRepository.getGradeById(id);

  if (!grade) {
    throw new AppError("Grade not found", HTTP_STATUS.NOT_FOUND);
  }

  return grade;
};

/**
 * Get grade by code
 * @param {String} code - Grade code
 * @returns {Promise<Grade>}
 * @throws {AppError} If grade not found
 */
const getGradeByCode = async (code) => {
  const grade = await gradeRepository.getGradeByCode(code);

  if (!grade) {
    throw new AppError("Grade not found", HTTP_STATUS.NOT_FOUND);
  }

  return grade;
};

/**
 * Update a grade
 * @param {String} id - Grade ID
 * @param {Object} data - Updated data
 * @param {String} updatedBy - ID of user updating the grade
 * @returns {Promise<Grade>}
 * @throws {AppError} If grade not found or duplicate name/code
 */
const updateGrade = async (id, data, updatedBy) => {
  const updateData = {
    ...data,
    updatedBy,
  };

  try {
    const grade = await gradeRepository.updateGrade(id, updateData);

    if (!grade) {
      throw new AppError("Grade not found", HTTP_STATUS.NOT_FOUND);
    }

    return grade;
  } catch (error) {
    // Handle duplicate name or code error
    if (error.code === 11000) {
      const field = error.keyPattern?.name ? "name" : "code";
      throw new AppError(
        `Grade with this ${field} already exists`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    throw error;
  }
};

/**
 * Soft delete a grade
 * @param {String} id - Grade ID
 * @returns {Promise<Grade>}
 * @throws {AppError} If grade not found
 */
const deleteGrade = async (id) => {
  const grade = await gradeRepository.deleteGrade(id);

  if (!grade) {
    throw new AppError("Grade not found", HTTP_STATUS.NOT_FOUND);
  }

  return grade;
};

// Export all service functions as a single object
export const gradeService = {
  createGrade,
  getAllGrades,
  getGradeById,
  getGradeByCode,
  updateGrade,
  deleteGrade,
};
