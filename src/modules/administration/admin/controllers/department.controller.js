import departmentService from "../services/department.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import { ApiResponse } from "../../../../utils/ApiReponse.js";

/**
 * Department Controller
 *
 * Handles HTTP requests for department management.
 * All operations require ADMINISTRATOR role (enforced in routes).
 *
 * Endpoints:
 * - POST /api/v1/administration/departments - Create department
 * - GET /api/v1/administration/departments - Get all departments (with search/filter)
 * - GET /api/v1/administration/departments/:id - Get department by ID
 * - PUT /api/v1/administration/departments/:id - Update department
 * - DELETE /api/v1/administration/departments/:id - Delete department (soft delete)
 */

/**
 * Create a new department
 * POST /api/v1/administration/departments
 *
 * Request Body:
 * {
 *   name: String (required) - Department name
 *   description: String (optional) - Department description
 *   department_head: String (optional) - User ID of department head
 *   status: String (optional) - "ACTIVE" or "INACTIVE" (default: ACTIVE)
 * }
 *
 * Response: Created department object
 */
export const createDepartment = async (req, res, next) => {
  try {
    const { name, description, department_head, status } = req.body;
    const adminId = req.user?._id; // Get logged-in user ID from auth middleware

    // Validate required field
    if (!name) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Department name is required",
          ),
        );
    }

    // Create department
    const department = await departmentService.createDepartment(
      {
        name,
        description,
        department_head,
        status,
      },
      adminId,
    );

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          department,
          "Department created successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all departments with optional search and filters
 * GET /api/v1/administration/departments
 *
 * Query Parameters:
 * - page: Number (default: 1) - Page number for pagination
 * - limit: Number (default: 10) - Items per page
 * - search: String (optional) - Search in name, description, or code
 * - status: String (optional) - Filter by "ACTIVE" or "INACTIVE"
 *
 * Response: Array of departments with pagination metadata
 */
export const getDepartments = async (req, res, next) => {
  try {
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Extract filter parameters
    const filters = {
      search: req.query.search || "",
      status: req.query.status || "",
    };

    // Get departments from service
    const result = await departmentService.getAllDepartments(
      page,
      limit,
      filters,
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result.departments,
        "Departments retrieved successfully",
        {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      ),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single department by ID
 * GET /api/v1/administration/departments/:id
 *
 * URL Parameters:
 * - id: String - Department ID
 *
 * Response: Department object
 */
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await departmentService.getDepartmentById(id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          department,
          "Department retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a department
 * PUT /api/v1/administration/departments/:id
 *
 * URL Parameters:
 * - id: String - Department ID
 *
 * Request Body:
 * {
 *   name: String (optional) - Updated department name
 *   description: String (optional) - Updated description
 *   department_head: String (optional) - Updated department head user ID
 *   status: String (optional) - Updated status ("ACTIVE" or "INACTIVE")
 * }
 *
 * Response: Updated department object
 */
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, department_head, status } = req.body;
    const adminId = req.user?._id; // Get logged-in user ID

    // Update department
    const department = await departmentService.updateDepartment(
      id,
      {
        name,
        description,
        department_head,
        status,
      },
      adminId,
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          department,
          "Department updated successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a department (soft delete)
 * DELETE /api/v1/administration/departments/:id
 *
 * URL Parameters:
 * - id: String - Department ID
 *
 * Response: Success message
 */
export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await departmentService.deleteDepartment(id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          "Department deleted successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};
