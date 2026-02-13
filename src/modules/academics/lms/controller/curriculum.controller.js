import { curriculumService } from "../services/curriculum.services.js";
import { asyncHandler } from "../../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../../utils/ApiReponse.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

const createCurriculumFramework = asyncHandler(async (req, res) => {
    const { name, code, authority, academicYear, gradeId, subjects } = req.body;
    console.log(req.body, "REQ BODY");

    const createdBy = req.user._id;

    const curriculumFramework =
        await curriculumService.createCurriculumFramework({
            name,
            code,
            authority,
            academicYear,
            gradeId,
            subjects,
            createdBy
        });

    res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(
            HTTP_STATUS.CREATED,
            curriculumFramework,
            "Curriculum framework created successfully"
        )
    );
});

const getCurriculums = asyncHandler(async (req, res) => {
    const curriculums = await curriculumService.getCurriculumFramework();
    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            curriculums,
            "Curriculums fetched successfully"
        )
    );
});

const getCurriculumById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const curriculum = await curriculumService.getCurriculumFrameworkById(id);

    if (!curriculum) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
            new ApiResponse(HTTP_STATUS.NOT_FOUND, null, "Curriculum not found")
        );
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            curriculum,
            "Curriculum fetched successfully"
        )
    );
});

const updateCurriculumFramework = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedBy = req.user._id;

    const updatedCurriculum = await curriculumService.updateCurriculumFramework(id, req.body, updatedBy);

    if (!updatedCurriculum) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
            new ApiResponse(HTTP_STATUS.NOT_FOUND, null, "Curriculum not found")
        );
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            updatedCurriculum,
            "Curriculum updated successfully"
        )
    );
});

export const curriculumController = {
    createCurriculumFramework,
    getCurriculums,
    getCurriculumById,
    updateCurriculumFramework
};