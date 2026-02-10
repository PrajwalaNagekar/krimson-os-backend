import financeService from "../services/finance.service.js";
import { HTTP_STATUS } from "../../../utils/constants.js";

export const getFinanceOfficers = async (req, res, next) => {
  try {
    const officers = await financeService.getAllFinanceOfficers(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: officers,
    });
  } catch (error) {
    next(error);
  }
};

export const getFinanceOfficer = async (req, res, next) => {
  try {
    const officer = await financeService.getFinanceOfficerById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: officer,
    });
  } catch (error) {
    next(error);
  }
};

export const createFinanceOfficer = async (req, res, next) => {
  try {
    const officer = await financeService.createFinanceOfficer(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: officer,
      message: "Finance Officer created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateFinanceOfficer = async (req, res, next) => {
  try {
    const officer = await financeService.updateFinanceOfficer(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: officer,
      message: "Finance Officer updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFinanceOfficer = async (req, res, next) => {
  try {
    await financeService.deleteFinanceOfficer(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Finance Officer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
