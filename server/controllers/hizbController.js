import path from "path";
import fs from "fs";

import dataDir from "../utils/dataDir.js";

export const getAllHizb = async () => {
	try {
		const hizbDir = path.join(dataDir, "hizb");
		const files = fs.readdirSync(hizbDir);

		const hizbList = [];

		for (const file of files) {
			if (!file.endsWith(".json")) continue;

			const baseName = path.basename(file, ".json");
			const numberPart = baseName.split(" - ")[1];
			const hizbNumber = parseInt(numberPart, 10);

			const filePath = path.join(hizbDir, file);
			const fileContent = fs.readFileSync(filePath, "utf-8");
			const hizbData = JSON.parse(fileContent);

			hizbList.push({
				hizbNo: hizbNumber,
				...hizbData,
			});
		}
		hizbList.sort((a, b) => a.hizbNo - b.hizbNo);

		return hizbList;
	} catch (err) {
		console.error(`[Controller Error Fetching All Hizb] - ${err}`);
		throw err;
	}
};

export const getSpecificHizbData = async (hizbNumber) => {
	try {
		const hizbDir = path.join(dataDir, "hizb");
		const files = fs.readdirSync(hizbDir);

		const hizbFile = `Hizb - ${hizbNumber}.json`;

		if (!files.includes(hizbFile)) {
			throw new Error(
				`[Specific Page Fetch Error] - No page with number ${hizbNumber} exists`
			);
		}

		const filePath = path.join(hizbDir, hizbFile);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const hizbData = JSON.parse(fileContent);

		return hizbData;
	} catch (err) {
		console.error(
			`[Controller Error Fetching Specific Hizb Data] - ${err}`
		);
		throw err;
	}
};
