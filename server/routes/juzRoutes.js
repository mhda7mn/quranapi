import { Router } from "express";
import { BadRequestError, ServerError } from "../errors/errors.js";
import {
	getAllJuz,
	getSpecificJuzData,
} from "../controllers/juzController.js";

const juzRouter = Router();

juzRouter.get("/", async (req, res, next) => {
	try {
		const data = await getAllJuz();

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting All Juz Data"));
	}
});

juzRouter.get("/:number", async (req, res, next) => {
	try {
		const juzNumber = parseInt(req.params.number, 10);

		if (isNaN(juzNumber) || juzNumber > 30 || juzNumber < 1) {
			return next(
				new BadRequestError(`Juz Must Be A Number Between 1 And 30`)
			);
		}

		const data = await getSpecificJuzData(juzNumber);

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting Juz Data"));
	}
});

export default juzRouter;
