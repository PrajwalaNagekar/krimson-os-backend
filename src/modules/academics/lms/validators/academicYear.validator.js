import joi from "joi";

export const createAcademicYearSchema = joi.object({
    year: joi.string().optional(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    status: joi.string().optional(),
    isLocked: joi.boolean().optional(),
});
