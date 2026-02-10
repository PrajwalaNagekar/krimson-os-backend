import managementService from "../services/management.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getManagementMembers = async (req, res, next) => {
  try {
    const members = await managementService.getAllManagementMembers(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const getManagementMember = async (req, res, next) => {
  try {
    const member = await managementService.getManagementMemberById(
      req.params.id
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const createManagementMember = async (req, res, next) => {
  try {
    const member = await managementService.createManagementMember(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: member,
      message: "Management member created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateManagementMember = async (req, res, next) => {
  try {
    const member = await managementService.updateManagementMember(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: member,
      message: "Management member updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteManagementMember = async (req, res, next) => {
  try {
    await managementService.deleteManagementMember(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Management member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
