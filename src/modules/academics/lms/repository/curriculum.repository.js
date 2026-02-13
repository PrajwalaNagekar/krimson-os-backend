import { CurriculumFramework } from "../model/curriculumFramework.model.js";

const createCurriculumFramework = async (data, options = {}) => {
    return await CurriculumFramework.create([data], options);
};


const getCurriculumFramework = async () => {
    return await CurriculumFramework.find();
};

const getCurriculumFrameworkById = async (id) => {
    return await CurriculumFramework.findById(id);
};

const updateCurriculumFramework = async (id, data) => {
    return await CurriculumFramework.findByIdAndUpdate(id, data, { new: true });
};

const deleteCurriculumFramework = async (id) => {
    return await CurriculumFramework.findByIdAndDelete(id);
};
const getCurriculumFrameworkByCode = async (code) => {
    return await CurriculumFramework.findOne({ code });
};

export const curriculumRepository = {
    createCurriculumFramework,
    getCurriculumFramework,
    getCurriculumFrameworkById,
    updateCurriculumFramework,
    deleteCurriculumFramework,
    getCurriculumFrameworkByCode
};
