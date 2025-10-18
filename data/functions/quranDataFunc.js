import path from "path";
import fs from "fs";
import { addAyatData, createJsonFile, delay } from "./helperFunc.js";

const getAyahInfo = async (surahNumber, ayahIndex) => {
	const baseApiLink = "https://quranapi.pages.dev/api"; //API link for fetching quran data

	const responseAyah = await fetch(
		`${baseApiLink}/${surahNumber}/${ayahIndex}.json`
	);

	return await responseAyah.json();
};

const getAyahTafseer = async (surahNumber, ayahIndex) => {
	const tafseerId = [1, 2, 3, 4, 6, 7, 8]; //Get tafseer books, ignoring tafseer book number 5

	const baseApiLink = "http://api.quran-tafseer.com/tafseer"; //API to fetch tafseer data, not available in quranapi.pages.dev

	let tafseer = [];
	for (let id in tafseerId) {
		const response = await fetch(
			`${baseApiLink}/${tafseerId[id]}/${surahNumber}/${ayahIndex}`
		);
		const data = await response.json();
		tafseer.push({
			tafseerBookName: data.tafseer_name,
			tafseer: data.text,
		});
	}
	return tafseer;
};

const getAyahMetaData = async (surahNumber, ayahIndex) => {
	const baseApiLink = `https://api.alquran.cloud/v1/ayah`; //API has more data than quranapi.pages.dev in regards to hizbQuarter and juz

	const response = await fetch(
		`${baseApiLink}/${surahNumber}:${ayahIndex}/quran-uthmani`
	);

	return await response.json();
};

const processAyahData = async (
	dirname,
	folder,
	surah,
	surahNumber
) => {
	const surahData = {
		surahNo: surahNumber,
		surahNameAr: surah.surahNameArabic,
		surahNameArabicLong: surah.surahNameArabicLong,
		surahNameEn: surah.surahName,
		revelationPlace: surah.revelationPlace,
		totalAyat: surah.totalAyah,
		ayat: [],
	};
	const fileName = `${surahNumber} - ${surah.surahName}.json`;
	await createJsonFile(dirname, folder, fileName, surahData);

	for (let ayahIndex = 1; ayahIndex <= surah.totalAyah; ayahIndex++) {
		const ayahInfo = await getAyahInfo(surahNumber, ayahIndex);
		const ayahMetaData = await getAyahMetaData(
			surahNumber,
			ayahIndex
		);
		const tafseerInfo = await getAyahTafseer(surahNumber, ayahIndex);

		// Getting hizb number through dividing hizbQuarter by 4 (each hizb contains 4 hizb quarters)
		const hizbNumber = Math.ceil(ayahMetaData.data.hizbQuarter / 4);

		const ayahData = {
			ayahNo: ayahInfo.ayahNo,
			ayahArV1: ayahInfo.arabic1, // With tashkeel
			ayahArV2: ayahInfo.arabic2,
			ayahEn: ayahInfo.english,
			meta: {
				page: ayahMetaData.data.page,
				juz: ayahMetaData.data.juz,
				hizb: hizbNumber,
				hizbQuarter: ayahMetaData.data.hizbQuarter,
				sajda: ayahMetaData.data.sajda,
			},
			tafseer: tafseerInfo,
		};

		await addAyatData(dirname, folder, fileName, ayahInfo.ayahNo, [
			ayahData,
		]);
	}
};

export const getSurahData = async (dirname, folder) => {
	const baseApiLink = "https://quranapi.pages.dev/api";
	try {
		const response = await fetch(`${baseApiLink}/surah.json`);
		const data = await response.json();

		for (let index = 0; index < data.length; index++) {
			const surah = data[index];
			const surahNumber = index + 1;

			await processAyahData(dirname, folder, surah, surahNumber);
			await delay(1250); // Artificial delay to not get slowed down by API
		}
	} catch (err) {
		console.error(`[Error Fetching Surah Data] - ${err}`);
	}
};

export const getJuzData = async (dirname, surahFolder, juzFolder) => {
	try {
		const surahDir = path.join(dirname, surahFolder);
		const files = fs.readdirSync(surahDir);

		const juzMap = {};

		for (const file of files) {
			if (!file.endsWith(".json")) return;

			const filePath = path.join(surahDir, file);
			const surahContent = fs.readFileSync(filePath, "utf-8");
			const surahData = JSON.parse(surahContent);

			for (const ayah of surahData.ayat) {
				const juz = ayah.meta.juz;

				if (!juzMap[juz]) {
					juzMap[juz] = [];
				}

				juzMap[juz].push({
					ayahNo: ayah.ayahNo,
					ayahArV1: ayah.ayahArV1,
					ayahArV2: ayah.ayahArV2,
					ayahEn: ayah.ayahEn,
					ayahMeta: {
						page: ayah.meta.page,
						juz: ayah.meta.juz,
						hizb: ayah.meta.hizb,
						hizbQuarter: ayah.meta.hizbQuarter,
						sajda: ayah.meta.sajda,
					},
					surahMeta: {
						surahNo: surahData.surahNo,
						surahNameAr: surahData.surahNameAr,
						surahNameArabicLong: surahData.surahNameArabicLong,
						surahNameEn: surahData.surahNameEn,
						revelationPlace: surahData.revelationPlace,
						totalAyat: surahData.totalAyat,
					},
				});
			}
		}

		for (const juzNum in juzMap) {
			const ayat = juzMap[juzNum];
			ayat.sort((a, b) => {
				if (a.ayahMeta.page === b.ayahMeta.page) {
					return a.ayahMeta.ayahNoInSurah - b.ayahMeta.ayahNoInSurah;
				}
				return a.ayahMeta.page - b.ayahMeta.page;
			});

			await createJsonFile(
				dirname,
				juzFolder,
				`Juz - ${juzNum}.json`,
				ayat
			);
		}
	} catch (err) {
		console.error(`[Error Getting Juz Data] - ${err}`);
	}
};

export const processJuzToPage = async (
	dirname,
	juzFolder,
	pageFolder
) => {
	try {
		const juzDirectory = path.join(dirname, juzFolder);
		const files = fs.readdirSync(juzDirectory);

		const pageMap = {};

		for (const file of files) {
			if (!file.endsWith(".json")) continue;

			const filePath = path.join(juzDirectory, file);
			const juzContent = fs.readFileSync(filePath, "utf-8");
			const juzData = JSON.parse(juzContent);

			for (const ayah of juzData) {
				const pageNumber = ayah.ayahMeta?.page;
				if (!pageNumber) continue;

				if (!pageMap[pageNumber]) {
					pageMap[pageNumber] = [];
				}

				pageMap[pageNumber].push(ayah);
			}
		}

		for (const page in pageMap) {
			const ayat = pageMap[page];

			ayat.sort((a, b) => {
				if (a.surahMeta.surahNo === b.surahMeta.surahNo) {
					return a.ayahMeta.ayahNoInSurah - b.ayahMeta.ayahNoInSurah;
				}
				return a.surahMeta.surahNo - b.surahMeta.surahNo;
			});

			await createJsonFile(
				dirname,
				pageFolder,
				`Page - ${page}.json`,
				ayat
			);
		}
	} catch (err) {
		console.error(`[Error Processing Juz To Pages] - ${err}`);
	}
};

export const processJuzToHizb = async (
	dirname,
	juzFolder,
	hizbFolder
) => {
	const juzDirectory = path.join(dirname, juzFolder);
	const files = fs.readdirSync(juzDirectory);

	const hizbData = {};

	for (const file of files) {
		if (file.endsWith(".json")) {
			const filePath = path.join(juzDirectory, file);

			const fileContent = fs.readFileSync(filePath, "utf-8");
			const juzData = JSON.parse(fileContent);

			for (const ayah of juzData) {
				const { ayahMeta } = ayah;
				const hizbNumber = ayahMeta.hizb;

				if (!hizbData[hizbNumber]) {
					hizbData[hizbNumber] = [];
				}

				hizbData[hizbNumber].push(ayah);
			}
		}
	}

	for (const hizbNumber in hizbData) {
		const data = hizbData[hizbNumber];

		data.sort(
			(a, b) => a.ayahMeta.ayahNoInQuran - b.ayahMeta.ayahNoInQuran
		);

		await createJsonFile(
			dirname,
			hizbFolder,
			`Hizb - ${hizbNumber}.json`,
			data
		);
	}
};
