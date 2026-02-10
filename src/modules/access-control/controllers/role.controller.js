import roleService from "../services/role.service.js";
import { HTTP_STATUS } from "../../../utils/constants.js";

export const getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

export const getRole = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};
