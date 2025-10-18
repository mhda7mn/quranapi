import { Router } from "express";
import { BadRequestError, ServerError } from "../errors/errors.js";
import {
	getAllSurahs,
	getSpecificSurahData,
} from "../controllers/surahController.js";

const surahRouter = Router();

surahRouter.get("/", async (req, res, next) => {
	try {
		const data = await getAllSurahs();

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting All Surah Data"));
	}
});

surahRouter.get("/:number", async (req, res, next) => {
	try {
		const surahNumber = parseInt(req.params.number, 10);

		if (isNaN(surahNumber) || surahNumber > 114 || surahNumber < 1) {
			return next(
				new BadRequestError(
					"Surah Must Be A Number Between 1 And 114"
				)
			);
		}
		const surahData = await getSpecificSurahData(surahNumber);
		res.status(200).json(surahData);
	} catch (err) {
		return next(new ServerError("Error in Getting Surah Data"));
	}
});

export default surahRouter;
