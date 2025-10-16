import express from "express";
import dotenv from "dotenv";

import logger from "./utils/logger.js";
import surahRoutes from "./controllers/surahRoutes.js";

dotenv.config();

const app = express();

app.use("/surahs", surahRoutes);

app.use((err, req, res, next) => {
	if (err.log) {
		err.log(req);
	} else {
		logger.error(
			`Error occurred: ${err.message}, Stack: ${
				err.stack
			}, Request IP: ${req.ip}, User-Agent: ${req.get("User-Agent")}`
		);
	}
	res.status(err.statusCode || 500).json({
		status: err.statusCode,
		error: err.message,
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`[Quran API] - Listening in on port: ${PORT}`);
});
