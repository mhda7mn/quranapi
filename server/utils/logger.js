import winston from "winston";

const logFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.printf(({ timestamp, level, message }) => {
		return `[${timestamp}] ${level}: ${message}`;
	})
);

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		logFormat
	),
	transports: [
		new winston.transports.File({
			filename: path.join("logs", "error.log"),
			level: "error",
		}),
		new winston.transports.File({
			filename: path.join("logs", "combined.log"),
		}),
	],
});

export default logger;
