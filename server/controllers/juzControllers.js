import path from "path";
import fs from "fs";

import dataDir from "../utils/dataDir.js";

export const getAllJuz = async () => {
	try {
		const juzDir = path.join(dataDir, "juz");
		const files = fs.readdirSync(juzDir);

		const juzList = [];

		for (const file of files) {
			if (!file.endsWith(".json")) return;

			const baseName = path.basename(file, ".json"); // Remove .json from the file name

			const [namePart, numberPart] = baseName.split(" - ");
			const juzNumber = parseInt(numberPart, 10);

			juzList.push({ juz: juzNumber });
		}
		juzList.sort((a, b) => a.juz - b.juz);

		return juzList;
	} catch (err) {
		console.error(`[Controller Error Fetching All Juz] - ${err}`);
		throw err;
	}
};

export const getSpecificJuzData = async (juzNumber) => {
	try {
		const juzDir = path.join(dataDir, "juz");
		const files = fs.readdirSync(juzDir);

		const juzFile = files.find((file) => {
			return (
				file.startsWith("Juz -") && file.endsWith(`${juzNumber}.json`)
			);
		});

		if (!juzFile)
			throw new Error(
				`[Specific Juz Fetch Error] - No Such Juz With Number ${juzNumber} Exists`
			);

		const filePath = path.join(juzDir, juzFile);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const juzData = JSON.parse(fileContent);

		return juzData;
	} catch (err) {
		console.error(
			`[Controller Error Fetching Specific Juz Data] - ${err}`
		);
		throw err;
	}
};
