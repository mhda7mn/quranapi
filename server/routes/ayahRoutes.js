import { Router } from "express";
import { BadRequestError, ServerError } from "../errors/errors.js";
import { getAyahData } from "../controllers/ayahController.js";
import { getSpecificSurahData } from "../controllers/surahController.js";

const ayahRouter = Router();
// TODO: Add tafseer query
ayahRouter.get("/:surahNo/:ayahNo", async (req, res, next) => {
	try {
		const surahNo = parseInt(req.params.surahNo, 10);
		const ayahNo = parseInt(req.params.ayahNo, 10);
		const tafseerQuery = req.query.t;

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

		const data = await getAyahData(surahNo, ayahNo);

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error in Getting Ayah Data"));
	}
});

export default ayahRouter;
