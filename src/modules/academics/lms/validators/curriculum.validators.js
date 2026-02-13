import joi from "joi";

export const createCurriculumSchema = joi.object({
    name: joi.string().required(),
    code: joi.string().required(),
    authority: joi.string().optional(),
    gradeId: joi.string().required(),
    academicYear: joi.object({
        startDate: joi.date().required(),
        endDate: joi.date().required()
    }).required(),
    subjects: joi.array().items(
        joi.object({
            name: joi.string().required(),
            code: joi.string().required().uppercase().trim()
        })
    ).optional()
});
