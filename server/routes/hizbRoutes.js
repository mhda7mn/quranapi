import { Router } from "express";
import { BadRequestError, ServerError } from "../errors/errors.js";
import {
	getAllHizb,
	getSpecificHizbData,
} from "../controllers/hizbController.js";

const hizbRouter = Router();

hizbRouter.get("/", async (req, res, next) => {
	try {
		const data = await getAllHizb();

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting All Hizb Data"));
	}
});

hizbRouter.get("/:number", async (req, res, next) => {
	try {
		const hizbNumber = parseInt(req.params.number, 10);

		if (isNaN(hizbNumber) || hizbNumber > 60 || hizbNumber < 1) {
			return next(
				new BadRequestError(`Hizb Must Be A Number Between 1 And 60`)
			);
		}

		const data = await getSpecificHizbData(hizbNumber);

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting Hizb Data"));
	}
});

export default hizbRouter;
