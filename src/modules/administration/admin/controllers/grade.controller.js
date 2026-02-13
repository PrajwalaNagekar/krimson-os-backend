import { gradeService } from "../services/grade.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import { ApiResponse } from "../../../../utils/ApiReponse.js";

/**
 * Grade Controller
 *
 * Handles HTTP requests for grade management.
 * All operations require ADMINISTRATOR role (enforced in routes).
 *
 * Endpoints:
 * - POST /api/v1/administration/grades - Create grade
 * - GET /api/v1/administration/grades - Get all grades (with pagination/search)
 */

/**
 * Create a new grade
 * POST /api/v1/administration/grades
 *
 * Request Body:
 * {
 *   academicYearId: String (required) - Academic year reference
 *   name: String (required) - Grade name (e.g., "Grade 9")
 *   code: String (optional) - Short code (e.g., "G9")
 *   order: Number (required) - Display order (1, 2, 3...)
 *   defaultCapacity: Number (required) - Default student capacity
 *   hasSections: Boolean (optional) - Whether grade has sections
 *   nextGradeId: String (optional) - Next grade for promotion
 *   status: String (optional) - "ACTIVE", "INACTIVE", or "ARCHIVED"
 *   isPromotable: Boolean (optional) - Can students be promoted
 * }
 */
export const createGrade = async (req, res, next) => {
  try {
    const {
      academicYearId,
      name,
      code,
      order,
      defaultCapacity,
      hasSections,
      subjects, // Optional array of Subject ObjectIds
      nextGradeId,
      status,
      isPromotable,
    } = req.body;
    const adminId = req.user?._id; // Get logged-in user ID from auth middleware

    // Validate required fields
    if (!academicYearId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Academic year ID is required",
          ),
        );
    }

    if (!name) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Grade name is required",
          ),
        );
    }

    if (!order || order < 1) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Grade order must be at least 1",
          ),
        );
    }

    if (!defaultCapacity || defaultCapacity < 1) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Default capacity must be at least 1",
          ),
        );
    }

    // Create grade
    const grade = await gradeService.createGrade(
      {
        academicYearId,
        name,
        code,
        order,
        defaultCapacity,
        hasSections,
        subjects, // Optional subjects array
        nextGradeId,
        status,
        isPromotable,
      },
      adminId,
    );

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          grade,
          "Grade created successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all grades with pagination and search
 * GET /api/v1/administration/grades
 *
 * Query Parameters:
 * - page: Number (default: 1) - Page number for pagination
 * - limit: Number (default: 10) - Items per page
 * - search: String (optional) - Search in name, code
 * - status: String (optional) - Filter by "ACTIVE", "INACTIVE", or "ARCHIVED"
 * - academicYearId: String (optional) - Filter by academic year
 *
 * Response: Array of grades with pagination metadata
 */
export const getGrades = async (req, res, next) => {
  try {
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Extract filter parameters
    const filters = {
      search: req.query.search || "",
      status: req.query.status || "",
      academicYearId: req.query.academicYearId || "", // ACTIVE: Academic year filtering
    };

    // Get grades from service
    const result = await gradeService.getAllGrades(page, limit, filters);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result.grades,
        "Grades retrieved successfully",
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
