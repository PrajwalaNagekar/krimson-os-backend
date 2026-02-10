import parentService from "../services/parent.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getParents = async (req, res, next) => {
  try {
    const parents = await parentService.getAllParents(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: parents,
    });
  } catch (error) {
    next(error);
  }
};

export const getParent = async (req, res, next) => {
  try {
    const parent = await parentService.getParentById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};

export const createParent = async (req, res, next) => {
  try {
    const parent = await parentService.createParent(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: parent,
      message: "Parent created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateParent = async (req, res, next) => {
  try {
    const parent = await parentService.updateParent(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: parent,
      message: "Parent updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteParent = async (req, res, next) => {
  try {
    await parentService.deleteParent(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Parent deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
