import { Router } from "express";
import { BadRequestError, ServerError } from "../errors/errors.js";
import {
	getAllPages,
	getSpecificPageData,
} from "../controllers/pageController.js";

const pageRouter = Router();

pageRouter.get("/", async (req, res, next) => {
	try {
		const data = await getAllPages();

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting All Pages Data"));
	}
});

pageRouter.get("/:number", async (req, res, next) => {
	try {
		const pageNumber = parseInt(req.params.number, 10);

		if (isNaN(pageNumber) || pageNumber > 604 || pageNumber < 1) {
			return next(
				new BadRequestError(`Page Must Be A Number Between 1 And 604`)
			);
		}

		const data = await getSpecificPageData(pageNumber);

		res.status(200).json(data);
	} catch (err) {
		return next(new ServerError("Error In Getting Page Data"));
	}
});

export default pageRouter;
