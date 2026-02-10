import itAdminService from "../services/itAdmin.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getITAdmins = async (req, res, next) => {
  try {
    const itAdmins = await itAdminService.getAllITAdmins(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: itAdmins,
    });
  } catch (error) {
    next(error);
  }
};

export const getITAdmin = async (req, res, next) => {
  try {
    const itAdmin = await itAdminService.getITAdminById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: itAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export const createITAdmin = async (req, res, next) => {
  try {
    const itAdmin = await itAdminService.createITAdmin(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: itAdmin,
      message: "IT Admin created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateITAdmin = async (req, res, next) => {
  try {
    const itAdmin = await itAdminService.updateITAdmin(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: itAdmin,
      message: "IT Admin updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteITAdmin = async (req, res, next) => {
  try {
    await itAdminService.deleteITAdmin(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "IT Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
