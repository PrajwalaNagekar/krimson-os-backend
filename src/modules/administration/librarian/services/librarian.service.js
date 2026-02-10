import librarianRepository from "../repositories/librarian.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

class LibrarianService {
  async getAllLibrarians(query) {
    return await librarianRepository.findAll(query);
  }

  async getLibrarianById(id) {
    const librarian = await librarianRepository.findById(id);
    if (!librarian) {
      throw new AppError("Librarian not found", HTTP_STATUS.NOT_FOUND);
    }
    return librarian;
  }

  async createLibrarian(data) {
    if (data.user) {
      const existingLibrarian = await librarianRepository.findByUserId(
        data.user
      );
      if (existingLibrarian) {
        throw new AppError(
          "Librarian profile already exists for this user",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return await librarianRepository.create(data);
  }

  async updateLibrarian(id, data) {
    const librarian = await librarianRepository.update(id, data);
    if (!librarian) {
      throw new AppError("Librarian not found", HTTP_STATUS.NOT_FOUND);
    }
    return librarian;
  }

  async deleteLibrarian(id) {
    const librarian = await librarianRepository.delete(id);
    if (!librarian) {
      throw new AppError("Librarian not found", HTTP_STATUS.NOT_FOUND);
    }
    return librarian;
  }
}

export default new LibrarianService();
