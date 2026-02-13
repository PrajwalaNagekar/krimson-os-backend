/**
 * Attaches audit fields (createdBy/updatedBy) to a data object.
 * This is a helper for services/controllers to consistently assign user IDs.
 * 
 * @param {Object} data - The data object to transform
 * @param {string|mongoose.Types.ObjectId} userId - The current user's ID
 * @param {boolean} isUpdate - If true, only attaches updatedBy. If false, attaches both.
 * @returns {Object} The transformed data object
 */
export const withAudit = (data, userId, isUpdate = false) => {
    const id = userId || "";

    if (isUpdate) {
        return {
            ...data,
            updatedBy: id,
            default: null
        };
    }

    return {
        ...data,
        createdBy: id,
        updatedBy: null // Send as empty string if not updated yet (on creation)
    };
};
