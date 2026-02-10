import counselorService from "../services/counselor.service.js";
import { HTTP_STATUS } from "../../../utils/constants.js";

export const getCounselors = async (req, res, next) => {
  try {
    const counselors = await counselorService.getAllCounselors(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: counselors,
    });
  } catch (error) {
    next(error);
  }
};

export const getCounselor = async (req, res, next) => {
  try {
    const counselor = await counselorService.getCounselorById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: counselor,
    });
  } catch (error) {
    next(error);
  }
};

export const createCounselor = async (req, res, next) => {
  try {
    const counselor = await counselorService.createCounselor(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: counselor,
      message: "Counselor created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCounselor = async (req, res, next) => {
  try {
    const counselor = await counselorService.updateCounselor(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: counselor,
      message: "Counselor updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCounselor = async (req, res, next) => {
  try {
    await counselorService.deleteCounselor(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Counselor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
