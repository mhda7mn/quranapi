import fs from "fs";
import path from "path";
import { downloadFile } from "./helperFunc.js";

const audioApiUrl = "https://quranapi.pages.dev/api/surah.json";

export const scrapeAyatAudio = async (
	dirname,
	folder,
	reciterName,
	audioUrl
) => {
	try {
		const response = await fetch(audioApiUrl);
		const data = await response.json();

		for (let i = 0; i < data.surahs.length; i++) {
			const surah = data.surahs[i];
			const surahName = surah.surahName;
			const totalAyat = surah.totalAyah;
			const surahNo = i + 1;

			console.info(
				`[Processing Ayah Audio] - ${surahNo} - ${surahName} (${totalAyat})`
			);

			const folderName = `${surahNo}`;
			const folderPath = path.join(
				dirname,
				folder,
				reciterName.replace(/\s+/g, "").toLowerCase(),
				folderName
			);

			if (!fs.existsSync(folderPath)) {
				fs.mkdirSync(folderPath, { recursive: true });
			}

			for (let ayahIndex = 1; ayahIndex <= totalAyat; ayahIndex++) {
				const surahId = String(surahNo).padStart(3, "0"); // Pads surah number with zeroes
				const ayahId = String(ayahIndex).padStart(3, "0");
				const fileName = `${surahId}${ayahId}.mp3`;
				const url = `${audioUrl}${fileName}`; //API to fetch quran audio

				const filePath = path.join(folderPath, fileName);

				await downloadFile(url, filePath);

				const renamedFilePath = path.join(
					folderPath,
					`${ayahIndex}.mp3`
				);

				fs.rename(filePath, renamedFilePath, (err) => {
					err
						? console.error(
								`[Error Renaming Ayah Audio File] - ${err}`
						  )
						: console.info(`[Ayah Audio Renamed] - ${ayahIndex}.mp3`);
				});
			}
		}
	} catch (err) {
		console.error(`[Error Scraping Ayah Audio] - ${err}`);
	}
};

const getSurahNames = async () => {
	const baseApiUrl = "https://quranapi.pages.dev/api/surah.json";
	try {
		const response = await fetch(baseApiUrl);
		const data = await response.json();

		const surahNamesMap = {};

		data.forEach((surah, index) => {
			const surahId = (index + 1).toString().padStart(3, "0");
			surahNamesMap[surahId] = surah.surahName;
		});

		return surahNamesMap;
	} catch (err) {
		console.error(`[Error Fetching Surah Names] -  ${err}`);
		return;
	}
};

const scrapeRectireAudio = async (
	dirname,
	folder,
	reciterNamesToDownload,
	reciter
) => {
	try {
		if (!reciterNamesToDownload.includes(reciter.name)) {
			console.info(`[Skipping reciter] - ${reciter.name}`);
			return;
		}

		const reciterFolderPath = path.join(
			dirname,
			folder,
			reciter.name.replace(/\s+/g, "").toLowerCase()
		);

		if (!fs.existsSync(reciterFolderPath)) {
			fs.mkdirSync(reciterFolderPath, { recursive: true });
		}

		for (let moshaf of reciter.moshaf) {
			const moshafFolderPath = path.join(
				reciterFolderPath,
				moshaf.name.replace(/\s+/g, "").toLowerCase()
			);

			if (!fs.existsSync(moshafFolderPath)) {
				fs.mkdirSync(moshafFolderPath, { recursive: true });
			}

			const surahList = moshaf.surah_list.split(",");
			const serverUrl = moshaf.server;

			for (let i = 0; i < surahList.length; i++) {
				const surahId = surahList[i].padStart(3, "0");

				const fileName = `${surahId}.mp3`;
				const audioUrl = `${serverUrl}${surahId}.mp3`;

				const filePath = path.join(moshafFolderPath, fileName);

				await downloadFile(audioUrl, filePath);
			}
		}
	} catch (err) {
		console.error(`[Error scraping reciter audio] - ${err}`);
	}
};

export const fetchRecitersAndScrapeSurahAudio = async (
	dirname,
	folder
) => {
	const baseApiUrl =
		"https://www.mp3quran.net/api/v3/reciters?language=eng";
	try {
		const reciterNames = [
			"Mohammed Siddiq Al-Minshawi",
			"Abdulbasit Abdulsamad",
			"Mahmoud Khalil Al-Hussary",
			"Mishary Alafasi",
			"Mohammed Ayyub",
			"Maher Al Meaqli",
			"Idrees Abkr",
		];

		const response = await fetch(baseApiUrl);
		const data = await response.json();

		const reciters = data.reciters;

		const surahNamesMap = await getSurahNames();

		for (let i = 0; i < reciters.length; i++) {
			const reciter = reciters[i];
			await scrapeRectireAudio(
				dirname,
				folder,
				surahNamesMap,
				reciter
			);
		}
	} catch (err) {
		console.error(`[Error Fetching Reciter Audio] - ${err}`);
	}
};
