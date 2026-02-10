import librarianService from "../services/librarian.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

export const getLibrarians = async (req, res, next) => {
  try {
    const librarians = await librarianService.getAllLibrarians(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: librarians,
    });
  } catch (error) {
    next(error);
  }
};

export const getLibrarian = async (req, res, next) => {
  try {
    const librarian = await librarianService.getLibrarianById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: librarian,
    });
  } catch (error) {
    next(error);
  }
};

export const createLibrarian = async (req, res, next) => {
  try {
    const librarian = await librarianService.createLibrarian(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: librarian,
      message: "Librarian created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateLibrarian = async (req, res, next) => {
  try {
    const librarian = await librarianService.updateLibrarian(
      req.params.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: librarian,
      message: "Librarian updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLibrarian = async (req, res, next) => {
  try {
    await librarianService.deleteLibrarian(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Librarian deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
