import User from "../models/UserSchema.js";

/**
 * User Repository - Data Access Layer
 * Handles all database operations for User model
 */
class UserRepository {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email) {
    return await User.findOne({ email }).select("+password_hash");
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(userId) {
    return await User.findOne({ user_id: userId });
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Users and total count
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .select("-password_hash")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await User.countDocuments();

    return { users, total };
  }

  /**
   * Update user by ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  async update(userId, updateData) {
    return await User.findOneAndUpdate({ user_id: userId }, updateData, {
      new: true,
      runValidators: true,
    }).select("-password_hash");
  }

  /**
   * Delete user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Deleted user or null
   */
  async delete(userId) {
    return await User.findOneAndDelete({ user_id: userId });
  }

  /**
   * Find user by identifier (email, user_id, or sso_provider)
   * @param {string} identifier - Email, user_id, or sso_provider value
   * @returns {Promise<Object|null>} User object or null
   */
  async findByIdentifier(identifier) {
    return await User.findOne({
      $or: [
        { email: identifier },
        { user_id: identifier },
        { sso_provider: identifier },
      ],
    }).select("-password_hash");
  }

  /**
   * Update user status
   * @param {string} userId - User ID
   * @param {string} status - New status (active, inactive, suspended)
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateStatus(userId, status) {
    return await User.findOneAndUpdate(
      { user_id: userId },
      { status },
      { new: true, runValidators: true }
    ).select("-password_hash");
  }

  /**
   * Find all users with populated role data
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Users and total count
   */
  async findAllWithRoles(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .select("-password_hash")
      .populate("role_data")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await User.countDocuments();

    return { users, total };
  }
}

export default new UserRepository();
