import path from "path";
import fs from "fs";

import dataDir from "../utils/dataDir.js";
import { getSpecificSurahData } from "./surahController.js";
import { getAyahData } from "./ayahController.js";

export const getAllSurahRecitations = async (url) => {
	try {
		const recitationsDir = path.join(dataDir, "audio/surahs");

		const surahMap = {};

		const reciters = fs.readdirSync(recitationsDir);

		for (const reciter of reciters) {
			const reciterPath = path.join(recitationsDir, reciter);
			if (!fs.statSync(reciterPath).isDirectory()) continue;

			const recitations = fs.readdirSync(reciterPath);

			for (const recitation of recitations) {
				const recitationPath = path.join(reciterPath, recitation);
				if (!fs.statSync(recitationPath).isDirectory()) continue;

				const files = fs.readdirSync(recitationPath);

				for (const file of files) {
					if (!file.endsWith(".mp3")) continue;

					const fileName = path.basename(file, ".mp3");
					const surahNo = parseInt(fileName, 10);
					if (isNaN(surahNo)) continue;

					const path = `${url}/audio/surahs/${reciter}/${recitation}/${file}`;

					if (!surahMap[surahNo]) {
						surahMap[surahNo] = [];
					}

					surahMap[surahNo].push({
						reciter,
						recitation,
						path,
					});
				}
			}
		}

		const result = Object.entries(surahMap)
			.map(([surahNo, recitations]) => ({
				surahNo: parseInt(surahNo, 10),
				recitations,
			}))
			.sort((a, b) => a.surahNo - b.surahNo);

		return result;
	} catch (err) {
		console.error(
			`[Controller Error Fetching All Surah Recitations] - ${err}`
		);
		throw err;
	}
};

export const getRecitationsBySurah = async (surahNumber, url) => {
	try {
		const surahFileName =
			surahNumber.toString().padStart(3, "0") + ".mp3";
		const recitationsDir = path.join(dataDir, "audio/surahs");

		const reciters = fs.readdirSync(recitationsDir);
		const recitationsList = [];

		const { ayat, ...surah } = await getSpecificSurahData(
			surahNumber
		);

		for (const reciter of reciters) {
			const reciterPath = path.join(recitationsDir, reciter);
			if (!fs.statSync(reciterPath).isDirectory()) continue;

			const recitationTypes = fs.readdirSync(reciterPath);

			for (const recitation of recitationTypes) {
				const recitationPath = path.join(reciterPath, recitation);
				if (!fs.statSync(recitationPath).isDirectory()) continue;

				const filePath = path.join(recitationPath, surahFileName);

				if (fs.existsSync(filePath)) {
					const path = `${url}/audio/surahs/${reciter}/${recitation}/${surahFileName}`;

					recitationsList.push({
						reciter,
						recitation,
						path,
					});
				}
			}
		}

		return {
			surah,
			recitations: recitationsList,
		};
	} catch (err) {
		console.error(
			`[Controller Error Fetching Recitations for Surah] - ${err}`
		);
		throw err;
	}
};

export const getAyahRecitationsBySurah = async (surahNo, url) => {
	try {
		const recitationsDir = path.join(dataDir, "audio", "ayahs");
		const reciters = fs.readdirSync(recitationsDir);

		const surahStr = String(surahNo).padStart(3, "0");

		const ayahRecitations = [];

		const fullSurah = await getSpecificSurahData(surahNo);
		const { ayat, ...surahMeta } = fullSurah;
		const totalAyat = surahMeta.totalAyat;

		for (let ayahNo = 1; ayahNo <= totalAyat; ayahNo++) {
			const { tafseer, ...ayahData } = (
				await getAyahData(surahNo, ayahNo)
			).ayah;

			const recitations = [];
			const ayahStr = String(ayahNo).padStart(3, "0");
			const fileName = `${ayahStr}.mp3`;

			for (const reciter of reciters) {
				const surahDir = path.join(recitationsDir, reciter, surahStr);
				const filePath = path.join(surahDir, fileName);

				if (fs.existsSync(filePath)) {
					const recitationPath = `${url}/audio/ayahs/${reciter}/${surahStr}/${ayahStr}.mp3`;

					recitations.push({
						reciter,
						path: recitationPath,
					});
				}
			}

			ayahRecitations.push({
				ayahNo,
				ayah: ayahData,
				recitations,
			});
		}

		return {
			surah: surahMeta,
			ayat: ayahRecitations,
		};
	} catch (err) {
		console.error(
			`[Controller Error Fetching All Ayah Recitations for Surah ${surahNo}] - ${err}`
		);
		throw err;
	}
};

export const getRecitationsByAyah = async (surahNo, ayahNo, url) => {
	try {
		const recitationsDir = path.join(dataDir, "audio/ayahs");

		const reciters = fs.readdirSync(recitationsDir);
		const recitations = [];

		const surahStr = String(surahNo).padStart(3, "0");
		const ayahStr = String(ayahNo).padStart(3, "0");
		const fileName = `${ayahStr}.mp3`;

		const { ayah, ...surah } = await getAyahData(surahNo, ayahNo);
		const { tafseer, ...other } = ayah;

		for (const reciter of reciters) {
			const reciterDir = path.join(recitationsDir, reciter);
			const surahDir = path.join(reciterDir, surahStr);

			if (
				!fs.existsSync(surahDir) ||
				!fs.statSync(surahDir).isDirectory()
			) {
				continue;
			}

			const filePath = path.join(surahDir, fileName);

			if (fs.existsSync(filePath)) {
				const path = `${url}/audio/ayahs/${reciter}/${surahStr}/${ayahStr}.mp3`;

				recitations.push({
					reciter,
					path,
				});
			}
		}

		return {
			surah: surah,
			ayah: other,
			ayahNo: parseInt(ayahNo, 10),
			recitations,
		};
	} catch (err) {
		console.error(
			`[Controller Error Fetching Recitations for Surah ${surahNo}, Ayah ${ayahNo}] - ${err}`
		);
		throw err;
	}
};
