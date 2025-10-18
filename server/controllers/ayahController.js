import path from "path";
import fs from "fs";

import dataDir from "../utils/dataDir.js";

export const getAyahData = async (surahNumber, ayahNumber) => {
	try {
		const surahDir = path.join(dataDir, "surahs");
		const files = fs.readdirSync(surahDir);

		const surahFile = files.find((file) => {
			return (
				file.startsWith(`${surahNumber}`) && file.endsWith(".json")
			);
		});

		if (!surahFile) {
			throw new Error(
				`[Specific Ayah Fetch Error] - No Such Surah With Number ${surahNumber} Exists`
			);
		}

		const surahPath = path.join(surahDir, surahFile);
		const surahData = JSON.parse(fs.readFileSync(surahPath, "utf-8"));
		const { ayat, ...otherSurahData } = surahData;

		const ayah = ayat.find((a) => a.ayahNo === ayahNumber);

		if (!ayah) {
			throw new Error(
				`[Specific Ayah Fetch Error] - Ayah ${ayahNumber} Not Found in Surah ${surahNumber}`
			);
		}

		return {
			...otherSurahData,
			ayah,
		};
	} catch (err) {
		console.error(`[Controller Error Fetching Ayah Data] - ${err}`);
		throw err;
	}
};
