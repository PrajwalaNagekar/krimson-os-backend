import Grade from "../models/gradeSchema.model.js";

/**
 * Grade Repository
 *
 * Data access layer for Grade model.
 * Function-based pattern for consistency across the codebase.
 * Handles all database operations for grades.
 *
 * IMPORTANT: The schema now includes auto-filtering middleware that
 * automatically excludes soft-deleted records (deletedAt: null) in all find queries.
 */

/**
 * Create a new grade
 * @param {Object} data - Grade data
 * @returns {Promise<Grade>}
 */
const createGrade = async (data) => {
  const grade = await Grade.create(data);
  // Return populated document
  return await getGradeById(grade._id);
};

/**
 * Get all grades with pagination and search
 * @param {Object} filters - Filter criteria (search, status, academicYearId)
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Promise<{grades: Array, total: Number}>}
 */
const getAllGrades = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  // Note: deletedAt filtering is handled automatically by schema middleware

  // Search filter - searches in name, normalizedName, and code
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { normalizedName: { $regex: filters.search, $options: "i" } },
      { code: { $regex: filters.search, $options: "i" } },
    ];
  }

  // Status filter
  if (filters.status) {
    query.status = filters.status;
  }

  // Academic Year Filter (ACTIVE)
  if (filters.academicYearId) {
    query.academicYearId = filters.academicYearId;
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const grades = await Grade.find(query)
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    // FUTURE: Uncomment when AcademicYear model is implemented
    // .populate("academicYearId", "name startDate endDate")
    .populate("subjects", "name code status") // Populate subjects
    .populate("nextGradeId", "name code order") // Populate next grade for promotion
    .sort({ order: 1 }) // Sort by grade order (1, 2, 3...)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Grade.countDocuments(query);

  return { grades, total };
};

/**
 * Get grade by ID
 * @param {String} id - Grade ID
 * @returns {Promise<Grade>}
 */
const getGradeById = async (id) => {
  return await Grade.findById(id)
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    // FUTURE: Uncomment when AcademicYear model is implemented
    // .populate("academicYearId", "name startDate endDate")
    .populate("subjects", "name code status") // Populate subjects
    .populate("nextGradeId", "name code order");
};

/**
 * Get grade by code
 * @param {String} code - Grade code
 * @param {String} academicYearId - Academic year ID (optional)
 * @returns {Promise<Grade>}
 */
const getGradeByCode = async (code, academicYearId = null) => {
  const query = { code };
  if (academicYearId) {
    query.academicYearId = academicYearId;
  }

  return await Grade.findOne(query)
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    // FUTURE: Uncomment when AcademicYear model is implemented
    // .populate("academicYearId", "name startDate endDate")
    .populate("subjects", "name code status") // Populate subjects
    .populate("nextGradeId", "name code order");
};

/**
 * Update a grade
 * @param {String} id - Grade ID
 * @param {Object} data - Updated data
 * @returns {Promise<Grade>}
 */
const updateGrade = async (id, data) => {
  return await Grade.findByIdAndUpdate(id, data, { new: true })
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    // FUTURE: Uncomment when AcademicYear model is implemented
    // .populate("academicYearId", "name startDate endDate")
    .populate("subjects", "name code status") // Populate subjects
    .populate("nextGradeId", "name code order");
};

/**
 * Soft delete a grade
 * @param {String} id - Grade ID
 * @returns {Promise<Grade>}
 */
const deleteGrade = async (id) => {
  return await Grade.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true },
  );
};

// Export all repository functions as a single object
export const gradeRepository = {
  createGrade,
  getAllGrades,
  getGradeById,
  getGradeByCode,
  updateGrade,
  deleteGrade,
};
