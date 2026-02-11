import jwt from "jsonwebtoken";
import User from "../../modules/identity/models/UserSchema.js";
import AppError from "../errors/app.error.js";
import { HTTP_STATUS } from "../../utils/constants.js";
import { verifyToken } from "../../utils/tokens.js";


/* =========================
   AUTHENTICATION
========================= */
export const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log("Authorization header found");
      token = req.headers.authorization.split(" ")[1];
      console.log("Token retrieved successfully--->", token);
    } else if (req.cookies && req.cookies.accessToken) {
      console.log("Access token cookie found");
      token = req.cookies.accessToken;
    }


    if (!token) {
      console.log("no token", token);

      return next(
        new AppError("Not authorized, no token", HTTP_STATUS.UNAUTHORIZED)
      );
    }
    console.log("----token----", token);

    const decoded = verifyToken(token);
    console.log("decoded", decoded);
    const user = await User.findById(decoded.id)
      .select("-password_hash")
      .populate({
        path: "role_data",
        populate: { path: "permissions" },
      });

    if (!user) {
      return next(new AppError("User not found", HTTP_STATUS.UNAUTHORIZED));
    }

    if (user.status !== "active") {
      return next(
        new AppError("Account is inactive or suspended", HTTP_STATUS.FORBIDDEN)
      );
    }

    req.user = user;
    next();
  } catch (err) {
    next(
      new AppError(
        "Not authorized, token invalid or expired",
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }
};

/* =========================
   RBAC AUTHORIZATION
========================= */
export const authorizePermission = (resource, action) => {
  return (req, res, next) => {
    const role = req.user?.role_data;

    if (!role || !Array.isArray(role.permissions)) {
      return next(
        new AppError("RBAC permissions not loaded", HTTP_STATUS.FORBIDDEN)
      );
    }

    const allowed = role.permissions.some(
      (p) => p.resource === resource && p.action === action
    );

    if (!allowed) {
      return next(
        new AppError(
          `Not authorized to ${action} ${resource}`,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
};

/* =========================
   LEGACY ROLE AUTHORIZATION (backward compatibility)
========================= */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.active_role)) {
      return next(
        new AppError(
          `User role ${req.user.active_role} is not authorized to access this route`,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }
    next();
  };
};
