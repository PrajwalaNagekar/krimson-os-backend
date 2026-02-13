import { curriculumRepository } from "../repository/curriculum.repository.js";
import { academicYearRepository } from "../repository/academicYear.repository.js";
import { subjectRepository } from "../repository/subject.repository.js";
import mongoose from "mongoose";
import { CurriculumFramework } from "../model/curriculumFramework.model.js";
import { withAudit } from "../../../../utils/helpers.js";


const createCurriculumFramework = async (data) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { academicYear, createdBy, subjects, ...rest } = data;

        if (!academicYear?.startDate || !academicYear?.endDate) {
            throw new Error("Academic Year dates are required");
        }

        // 🔍 Find AcademicYear
        let academicYearDoc =
            await academicYearRepository.getAcademicYearByDates(
                academicYear.startDate,
                academicYear.endDate,
                { session }
            );

        // ➕ Create if not exists
        if (!academicYearDoc) {
            const academicYearData = withAudit({
                startDate: academicYear.startDate,
                endDate: academicYear.endDate
            }, createdBy);

            academicYearDoc =
                await academicYearRepository.createAcademicYear(academicYearData, { session });

            academicYearDoc = academicYearDoc[0];
        }

        if (academicYearDoc.isLocked) {
            throw new Error("Academic Year is locked");
        }

        // ✅ Create Curriculum via repository
        const curriculumData = withAudit({
            ...rest,
            academicYearId: academicYearDoc._id
        }, createdBy);

        const curriculum =
            await curriculumRepository.createCurriculumFramework(curriculumData, { session });

        const curriculumDoc = curriculum[0];

        // ✅ Create Subjects if provided
        if (subjects && subjects.length > 0) {
            const subjectsData = subjects.map(subject => withAudit({
                ...subject,
                curriculumId: curriculumDoc._id
            }, createdBy));

            await subjectRepository.createManySubjects(subjectsData, { session });
        }

        await session.commitTransaction();
        return curriculumDoc;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


const getCurriculumFramework = async () => {
    return await curriculumRepository.getCurriculumFramework();
};

const getCurriculumFrameworkById = async (id) => {
    return await curriculumRepository.getCurriculumFrameworkById(id);
};

const updateCurriculumFramework = async (id, data, userId) => {
    const updateData = withAudit(data, userId, true);
    return await curriculumRepository.updateCurriculumFramework(id, updateData);
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
