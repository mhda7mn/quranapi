import { Router } from "express";
import {
	BadRequestError,
	NotFoundError,
	ServerError,
} from "../errors/errors.js";
import {
	getAllSurahs,
	getSpecificSurahData,
} from "../controllers/surahController.js";

const surahRoutes = Router();

// all surahs {surahNumber, surahName, link: link for surah info (api)}
surahRoutes.get("/", async (req, res, next) => {
	try {
		const data = await getAllSurahs();

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting All Surah Data"));
	}
});

// Information about specific surah
surahRoutes.get("/:number", async (req, res, next) => {
	try {
		const surahNumber = parseInt(req.params.number, 10);

		if (isNaN(surahNumber) || surahNumber > 114 || surahNumber < 1) {
			return next(
				new BadRequestError(
					"Surah Number Must Be A Number Between 1 And 114"
				)
			);
		}
		const surahData = await getSpecificSurahData(surahNumber);
		res.status(200).json(surahData);
	} catch (err) {
		return next(new ServerError("Error in Getting Surah Data"));
	}
});

export default surahRoutes;
