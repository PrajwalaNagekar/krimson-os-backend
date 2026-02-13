import Department from "../models/departmentSchema.model.js";

/**
 * Department Repository
 *
 * Data access layer for Department model.
 * Handles all database operations for departments.
 * Function-based repository pattern for consistency across the codebase.
 */

/**
 * Find all departments with optional filters and pagination
 * @param {Object} filters - Filter criteria (search, status)
 * @param {Number} page - Page number (for pagination)
 * @param {Number} limit - Items per page
 * @returns {Promise<{departments: Array, total: Number}>}
 */
const findAllDepartments = async (filters = {}, page = 1, limit = 10) => {
  const query = { isDeleted: false }; // Only get non-deleted departments

  // Search filter - searches in name and description
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { code: { $regex: filters.search, $options: "i" } },
    ];
  }

  // Status filter - filter by ACTIVE or INACTIVE
  if (filters.status) {
    query.status = filters.status;
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const departments = await Department.find(query)
    .populate("department_head", "full_name email") // Populate department head details
    .populate("createdBy", "full_name email") // Populate creator details
    .populate("updatedBy", "full_name email") // Populate updater details
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Department.countDocuments(query);

  return { departments, total };
};

/**
 * Find department by MongoDB ID
 * @param {String} id - Department ID
 * @returns {Promise<Department>}
 */
const getDepartmentById = async (id) => {
  return await Department.findOne({ _id: id, isDeleted: false })
    .populate("department_head", "full_name email")
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email");
};

/**
 * Find department by unique code
 * @param {String} code - Department code (e.g., DEP-XXXXXXXX)
 * @returns {Promise<Department>}
 */
const getDepartmentByCode = async (code) => {
  return await Department.findOne({ code, isDeleted: false })
    .populate("department_head", "full_name email")
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email");
};

/**
 * Create a new department
 * @param {Object} data - Department data
 * @returns {Promise<Department>}
 */
const createDepartment = async (data) => {
  const department = await Department.create(data);
  // Return populated document
  return await getDepartmentById(department._id);
};

/**
 * Update an existing department
 * @param {String} id - Department ID
 * @param {Object} data - Updated data
 * @returns {Promise<Department>}
 */
const updateDepartment = async (id, data) => {
  return await Department.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }, // Return updated document
  )
    .populate("department_head", "full_name email")
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email");
};

/**
 * Soft delete a department
 * @param {String} id - Department ID
 * @returns {Promise<Department>}
 */
const deleteDepartment = async (id) => {
  return await Department.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};

// Export all repository functions as a single object
export const departmentRepository = {
  findAllDepartments,
  getDepartmentById,
  getDepartmentByCode,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
