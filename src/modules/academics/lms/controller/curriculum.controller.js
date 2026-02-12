import { curriculumService } from "../services/curriculum.services.js";
import { asyncHandler } from "../../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../../utils/ApiReponse.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

const createCurriculumFramework = asyncHandler(async (req, res) => {
    const { name, code, description } = req.body;
    const curriculumFramework = await curriculumService.createCurriculumFramework({ name, code, description });
    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, curriculumFramework, "Curriculum framework created successfully"));
});

export const curriculumController = {
    createCurriculumFramework
};
