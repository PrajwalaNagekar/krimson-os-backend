import coordinatorService from "../services/coordinator.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getCoordinators = async (req, res, next) => {
  try {
    const coordinators = await coordinatorService.getAllCoordinators(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: coordinators,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoordinator = async (req, res, next) => {
  try {
    const coordinator = await coordinatorService.getCoordinatorById(
      req.params.id
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: coordinator,
    });
  } catch (error) {
    next(error);
  }
};

export const createCoordinator = async (req, res, next) => {
  try {
    const coordinator = await coordinatorService.createCoordinator(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: coordinator,
      message: "Coordinator created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoordinator = async (req, res, next) => {
  try {
    const coordinator = await coordinatorService.updateCoordinator(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: coordinator,
      message: "Coordinator updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoordinator = async (req, res, next) => {
  try {
    await coordinatorService.deleteCoordinator(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Coordinator deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
