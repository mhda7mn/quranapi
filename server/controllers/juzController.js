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

			const baseName = path.basename(file, ".json");
			const numberPart = baseName.split(" - ")[1];
			const juzNumber = parseInt(numberPart, 10);

			const filePath = path.join(juzDir, file);
			const fileContent = fs.readFileSync(filePath, "utf-8");
			const juzData = JSON.parse(fileContent);

			juzList.push({
				juzNo: juzNumber,
				...juzData,
			});
		}

		juzList.sort((a, b) => a.juzNo - b.juzNo);

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

		const juzFile = `Juz - ${juzNumber}.json`;

		if (!files.includes(juzFile)) {
			throw new Error(
				`[Specific Page Fetch Error] - No page with number ${juzNumber} exists`
			);
		}

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
