import path from "path";
import fs from "fs";

import dataDir from "../utils/dataDir.js";

export const getAllSurahs = async () => {
	try {
		const surahDir = path.join(dataDir, "surahs");
		const files = fs.readdirSync(surahDir);

		const surahList = [];

		for (const file of files) {
			if (!file.endsWith(".json")) continue;

			const filePath = path.join(surahDir, file);
			const fileContent = fs.readFileSync(filePath, "utf-8");
			const surahData = JSON.parse(fileContent);

			surahList.push(surahData);
		}

		surahList.sort((a, b) => a.surahNo - b.surahNo);

		return surahList;
	} catch (err) {
		console.error(`[Controller Error Fetching All Surahs] - ${err}`);
		throw err;
	}
};

export const getSpecificSurahData = async (surahNumber) => {
	try {
		const surahDir = path.join(dataDir, "surahs");
		const files = fs.readdirSync(surahDir);

		const surahFile = files.find((file) => {
			return (
				file.startsWith(`${surahNumber}`) && file.endsWith(".json")
			);
		});

		if (!surahFile)
			throw new Error(
				`[Specific Surah Fetch Error] - No Such Surah With Number ${surahNumber} Exists`
			);

		const filePath = path.join(surahDir, surahFile);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const surahData = JSON.parse(fileContent);

		return surahData;
	} catch (err) {
		console.error(
			`[Controller Error Fetching Specific Surah Data] - ${err}`
		);
		throw err;
	}
};
