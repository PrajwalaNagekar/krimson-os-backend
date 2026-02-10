import adminService from "../services/admin.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: admin,
      message: "Admin created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: admin,
      message: "Admin updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    await adminService.deleteAdmin(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
