import { Subject } from "../model/subject.model.js";

const createSubject = async (data, options = {}) => {
    return await Subject.create([data], options);
};

const createManySubjects = async (subjects, options = {}) => {
    return await Subject.insertMany(subjects, options);
};

const getSubjectsByCurriculumId = async (curriculumId) => {
    return await Subject.find({ curriculumId, isDeleted: false });
};

const getSubjectById = async (id) => {
    return await Subject.findById(id);
};

const updateSubject = async (id, data) => {
    return await Subject.findByIdAndUpdate(id, data, { new: true });
};

const deleteSubject = async (id) => {
    return await Subject.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const subjectRepository = {
    createSubject,
    createManySubjects,
    getSubjectsByCurriculumId,
    getSubjectById,
    updateSubject,
    deleteSubject
};
