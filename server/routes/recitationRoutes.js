import { Router } from "express";

import {
	getAllSurahRecitations,
	getAyahRecitationsBySurah,
	getRecitationsByAyah,
	getRecitationsBySurah,
} from "../controllers/recitationController.js";
import { BadRequestError, ServerError } from "../errors/errors.js";
import { getSpecificSurahData } from "../controllers/surahController.js";

const recitationRouter = Router();

recitationRouter.get("/surahs", async (req, res, next) => {
	try {
		const data = await getAllSurahRecitations(
			"http://localhost:3000"
		);

		res.status(200).json(data);
	} catch (err) {
		return next(
			new ServerError("Error in Getting All Surah Recitations")
		);
	}
});

recitationRouter.get(
	"/surahs/:surahNumber",
	async (req, res, next) => {
		try {
			const surahNo = parseInt(req.params.surahNumber, 10);

			if (isNaN(surahNo) || surahNo > 114 || surahNo < 1) {
				return next(
					new BadRequestError(
						"Surah Must Be A Number Between 1 And 114"
					)
				);
			}

			const data = await getRecitationsBySurah(
				surahNo,
				"http://localhost:3000"
			);

			res.status(200).json(data);
		} catch (err) {
			return next(
				new ServerError("Error in Getting Surah Recitations")
			);
		}
	}
);

recitationRouter.get("/ayah/:surahNumber", async (req, res, next) => {
	try {
		const surahNo = parseInt(req.params.surahNumber, 10);

		if (isNaN(surahNo) || surahNo > 114 || surahNo < 1) {
			return next(
				new BadRequestError(
					"Surah Must Be A Number Between 1 And 114"
				)
			);
		}

		const data = await getAyahRecitationsBySurah(
			surahNo,
			"http://localhost:3000"
		);

		res.status(200).json(data);
	} catch (err) {
		return next(
			new ServerError("Error In Getting Surah Ayah Recitations")
		);
	}
});

recitationRouter.get(
	"/ayah/:surahNumber/:ayahNumber",
	async (req, res, next) => {
		try {
			const surahNo = parseInt(req.params.surahNumber, 10);
			const ayahNo = parseInt(req.params.ayahNumber, 10);

			if (isNaN(surahNo) || surahNo > 114 || surahNo < 1) {
				return next(
					new BadRequestError(
						"Surah Must Be A Number Between 1 And 114"
					)
				);
			}

			const surahData = await getSpecificSurahData(surahNo);
			const ayat = surahData.ayat;

			if (isNaN(ayahNo) || ayahNo > ayat.length || ayahNo < 1)
				return next(
					new BadRequestError(
						`Ayah Must Be A Number Between 1 and ${ayat.length}`
					)
				);

			const data = await getRecitationsByAyah(
				surahNo,
				ayahNo,
				"http://localhost:3000"
			);

			res.status(200).json(data);
		} catch (err) {
			return next(
				new ServerError("Error In Getting Ayah Recitiations")
			);
		}
	}
);

export default recitationRouter;
