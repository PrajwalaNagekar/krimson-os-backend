import AppError from "../core/errors/app.error.js";
import { HTTP_STATUS } from "../utils/constants.js";

/**
 * Self-Access Middleware
 * Allows users to access only their own records based on role-specific logic
 */

/**
 * Allow Parent to access their own record only
 * Requires parent.controller to populate req.parentUserId from the Parent model
 */
export const allowSelfParent = async (req, res, next) => {
  try {
    const requestedId = req.params.id;
    const currentUserId = req.user._id; // From protect middleware
    const currentRole = req.user.active_role;

    // Import Parent model
    const Parent = (
      await import("../../modules/academics/parent/models/ParentSchema.js")
    ).default;

    // Find the parent record by ID
    const parent = await Parent.findById(requestedId).populate("user");

    if (!parent) {
      return next(new AppError("Parent not found", HTTP_STATUS.NOT_FOUND));
    }

    // Check if the logged-in user is the parent themselves
    const isOwnRecord = parent.user?._id?.toString() === currentUserId?.toString();

    if (!isOwnRecord && currentRole === "Parent") {
      return next(
        new AppError(
          "You can only access your own parent record",
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Allow Counselor to access their own record only
 * Requires counselor.controller to populate req.counselorUserId from the Counselor model
 */
export const allowSelfCounselor = async (req, res, next) => {
  try {
    const requestedId = req.params.id;
    const currentUserId = req.user._id; // From protect middleware
    const currentRole = req.user.active_role;

    // Import Counselor model
    const Counselor = (
      await import("../../modules/wellbeing/models/CounselorSchema.js")
    ).default;

    // Find the counselor record by ID
    const counselor = await Counselor.findById(requestedId).populate("user");

    if (!counselor) {
      return next(new AppError("Counselor not found", HTTP_STATUS.NOT_FOUND));
    }

    // Check if the logged-in user is the counselor themselves
    const isOwnRecord = counselor.user?._id?.toString() === currentUserId?.toString();

    if (!isOwnRecord && currentRole === "Counselor") {
      return next(
        new AppError(
          "You can only access your own counselor record",
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
