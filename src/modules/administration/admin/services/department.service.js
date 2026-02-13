import { departmentRepository } from "../repositories/department.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

/**
 * Department Service
 *
 * Business logic layer for Department operations.
 * Handles validation, error handling, and orchestrates repository operations.
 *
 * Methods:
 * - getAllDepartments: Get all departments with pagination and filters
 * - getDepartmentById: Get a single department by ID
 * - getDepartmentByCode: Get a single department by code
 * - createDepartment: Create a new department
 * - updateDepartment: Update an existing department
 * - deleteDepartment: Soft delete a department
 */

class DepartmentService {
  /**
   * Get all departments with optional filters and pagination
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Filter criteria (search, status)
   * @returns {Promise<Object>} - Paginated departments with metadata
   */
  async getAllDepartments(page = 1, limit = 10, filters = {}) {
    // Get departments from repository with pagination
    const { departments, total } =
      await departmentRepository.findAllDepartments(filters, page, limit);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      departments,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get department by ID
   * @param {String} id - Department ID
   * @returns {Promise<Department>}
   * @throws {AppError} If department not found
   */
  async getDepartmentById(id) {
    const department = await departmentRepository.getDepartmentById(id);

    if (!department) {
      throw new AppError("Department not found", HTTP_STATUS.NOT_FOUND);
    }

    return department;
  }

  /**
   * Get department by unique code
   * @param {String} code - Department code
   * @returns {Promise<Department>}
   * @throws {AppError} If department not found
   */
  async getDepartmentByCode(code) {
    const department = await departmentRepository.getDepartmentByCode(code);

    if (!department) {
      throw new AppError("Department not found", HTTP_STATUS.NOT_FOUND);
    }

    return department;
  }

  /**
   * Create a new department
   * @param {Object} data - Department data (name, description, department_head, status)
   * @param {String} createdBy - ID of user creating the department
   * @returns {Promise<Department>}
   * @throws {AppError} If department with same name already exists
   */
  async createDepartment(data, createdBy) {
    // Add createdBy to the data
    const departmentData = {
      ...data,
      createdBy,
    };

    try {
      // Create department (repository will handle validation)
      const department =
        await departmentRepository.createDepartment(departmentData);
      return department;
    } catch (error) {
      // Handle duplicate name error
      if (error.code === 11000) {
        throw new AppError(
          "Department with this name already exists",
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  /**
   * Update an existing department
   * @param {String} id - Department ID
   * @param {Object} data - Updated data
   * @param {String} updatedBy - ID of user updating the department
   * @returns {Promise<Department>}
   * @throws {AppError} If department not found or duplicate name
   */
  async updateDepartment(id, data, updatedBy) {
    // Add updatedBy to the data
    const updateData = {
      ...data,
      updatedBy,
    };

    try {
      const department = await departmentRepository.updateDepartment(
        id,
        updateData,
      );

      if (!department) {
        throw new AppError("Department not found", HTTP_STATUS.NOT_FOUND);
      }

      return department;
    } catch (error) {
      // Handle duplicate name error
      if (error.code === 11000) {
        throw new AppError(
          "Department with this name already exists",
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  /**
   * Soft delete a department
   * @param {String} id - Department ID
   * @returns {Promise<Department>}
   * @throws {AppError} If department not found
   */
  async deleteDepartment(id) {
    const department = await departmentRepository.deleteDepartment(id);

    if (!department) {
      throw new AppError("Department not found", HTTP_STATUS.NOT_FOUND);
    }

    return department;
  }
}

export default new DepartmentService();
