import Librarian from "../models/LibrarianSchema.js";

class LibrarianRepository {
  async findAll(query = {}) {
    return await Librarian.find(query).populate("user");
  }

  async findById(id) {
    return await Librarian.findById(id).populate("user");
  }

  async findByUserId(userId) {
    return await Librarian.findOne({ user: userId });
  }

  async create(data) {
    return await Librarian.create(data);
  }

  async update(id, data) {
    return await Librarian.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Librarian.findByIdAndDelete(id);
  }
}

export default new LibrarianRepository();
