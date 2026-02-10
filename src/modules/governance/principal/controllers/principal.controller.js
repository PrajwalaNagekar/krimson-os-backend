import principalService from "../services/principal.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getPrincipals = async (req, res, next) => {
  try {
    const principals = await principalService.getAllPrincipals(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: principals,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrincipal = async (req, res, next) => {
  try {
    const principal = await principalService.getPrincipalById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: principal,
    });
  } catch (error) {
    next(error);
  }
};

export const createPrincipal = async (req, res, next) => {
  try {
    const principal = await principalService.createPrincipal(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: principal,
      message: "Principal created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrincipal = async (req, res, next) => {
  try {
    const principal = await principalService.updatePrincipal(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: principal,
      message: "Principal updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePrincipal = async (req, res, next) => {
  try {
    await principalService.deletePrincipal(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Principal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
