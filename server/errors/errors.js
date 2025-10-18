import logger from "../utils/logger.js";

class CustomError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}

	log(req) {
		const stack = this.statusCode === 500 ? this.stack : "";

		const logMessage = `Error occurred: ${
			this.message
		}, Request IP: ${req.ip}, User-Agent: ${req.get(
			"User-Agent"
		)} \n  Stack: ${stack}`;

		logger.error(`[${this.statusCode}] ${logMessage}`);
	}
}

export class NotFoundError extends CustomError {
	constructor(message = "Resource Not Found") {
		super(message, 404);
	}
}

export class ServerError extends CustomError {
	constructor(message = "Internal Server Error") {
		super(message, 500);
	}
}

export class BadRequestError extends CustomError {
	constructor(message = "Bad Request") {
		super(message, 400);
	}
}
