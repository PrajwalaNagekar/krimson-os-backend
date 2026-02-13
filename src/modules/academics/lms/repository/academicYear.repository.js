import { AcademicYear } from "../model/academicYear.model.js";

const createAcademicYear = async (data, options = {}) => {
    return await AcademicYear.create([data], options); // array required for transactions
};

const getAcademicYearByDates = async (startDate, endDate, options = {}) => {
    return await AcademicYear.findOne({
        startDate,
        endDate
    }, null, options);
};

const getAcademicYearById = async (id, options = {}) => {
    return await AcademicYear.findById(id, null, options);
};

export const academicYearRepository = {
    createAcademicYear,
    getAcademicYearByDates,
    getAcademicYearById
};
