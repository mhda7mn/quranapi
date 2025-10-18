import path from "path";
import fs from "fs";

import dataDir from "../utils/dataDir.js";

export const getAllPages = async () => {
	try {
		const pagesDir = path.join(dataDir, "pages");
		const files = fs.readdirSync(pagesDir);

		const pagesList = [];

		for (const file of files) {
			if (!file.endsWith(".json")) continue;

			const baseName = path.basename(file, ".json");
			const numberPart = baseName.split(" - ")[1];
			const pageNumber = parseInt(numberPart, 10);

			const filePath = path.join(pagesDir, file);
			const fileContent = fs.readFileSync(filePath, "utf-8");
			const pageData = JSON.parse(fileContent);

			pagesList.push({
				pageNo: pageNumber,
				...pageData,
			});
		}
		pagesList.sort((a, b) => a.pageNo - b.pageNo);

		return pagesList;
	} catch (err) {
		console.error(`[Controller Error Fetching All Pages] - ${err}`);
		throw err;
	}
};

export const getSpecificPageData = async (pageNumber) => {
	try {
		const pagesDir = path.join(dataDir, "pages");
		const files = fs.readdirSync(pagesDir);

		const pageFile = `Page - ${pageNumber}.json`;

		if (!files.includes(pageFile)) {
			throw new Error(
				`[Specific Page Fetch Error] - No page with number ${pageNumber} exists`
			);
		}

		const filePath = path.join(pagesDir, pageFile);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const pageData = JSON.parse(fileContent);

		return pageData;
	} catch (err) {
		console.error(
			`[Controller Error Fetching Specific Page Data] - ${err}`
		);
		throw err;
	}
};
