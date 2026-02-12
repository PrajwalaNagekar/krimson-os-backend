import { curriculumRepository } from "../repository/curriculum.repository.js";

const createCurriculumFramework = async (data) => {
    return await curriculumRepository.createCurriculumFramework(data);
};

const getCurriculumFramework = async () => {
    return await curriculumRepository.getCurriculumFramework();
};

const getCurriculumFrameworkById = async (id) => {
    return await curriculumRepository.getCurriculumFrameworkById(id);
};

const updateCurriculumFramework = async (id, data) => {
    return await curriculumRepository.updateCurriculumFramework(id, data);
};

const deleteCurriculumFramework = async (id) => {
    return await curriculumRepository.deleteCurriculumFramework(id);
};

const getCurriculumFrameworkByCode = async (code) => {
    return await curriculumRepository.getCurriculumFrameworkByCode(code);
};

export const curriculumService = {
    createCurriculumFramework,
    getCurriculumFramework,
    getCurriculumFrameworkById,
    updateCurriculumFramework,
    deleteCurriculumFramework,
    getCurriculumFrameworkByCode
};
