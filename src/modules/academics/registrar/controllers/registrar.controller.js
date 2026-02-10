import registrarService from "../services/registrar.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getRegistrars = async (req, res, next) => {
  try {
    const registrars = await registrarService.getAllRegistrars(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: registrars,
    });
  } catch (error) {
    next(error);
  }
};

export const getRegistrar = async (req, res, next) => {
  try {
    const registrar = await registrarService.getRegistrarById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: registrar,
    });
  } catch (error) {
    next(error);
  }
};

export const createRegistrar = async (req, res, next) => {
  try {
    const registrar = await registrarService.createRegistrar(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: registrar,
      message: "Registrar created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateRegistrar = async (req, res, next) => {
  try {
    const registrar = await registrarService.updateRegistrar(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: registrar,
      message: "Registrar updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRegistrar = async (req, res, next) => {
  try {
    await registrarService.deleteRegistrar(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Registrar deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
