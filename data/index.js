import { fileURLToPath } from "url";
import path from "path";

import {
	getJuzData,
	getSurahData,
	processJuzToHizb,
	processJuzToPage,
} from "./functions/quranDataFunc.js";
import {
	fetchRecitersAndScrapeSurahAudio,
	scrapeAyatAudio,
} from "./functions/quranAudioDataFunc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ayahAudioLinks = [
	{
		path: "https://everyayah.com/data/Husary_128kbps_Mujawwad/",
		name: "HusaryMujawwad",
	},
	{
		path: "https://everyayah.com/data/Husary_128kbps/",
		name: "HusaryMurattal",
	},
	{
		path: "https://everyayah.com/data/Minshawy_Mujawwad_192kbps/",
		name: "MinshawyMujawwad",
	},
	{
		path: "https://everyayah.com/data/Minshawy_Murattal_128kbps/",
		name: "MinshawyMurattal",
	},
	{
		path: "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/",
		name: "AbdulBasitMujawwad",
	},
	{
		path: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/",
		name: "AbdulBasitMurattal",
	},
];

const scrapeAllData = async (dirname) => {
	console.info("[Beginning The Scraping Of Data]");

	await getSurahData(dirname, "quran/surahs");
	await getJuzData(dirname, "quran/juz");
	await processJuzToPage(dirname, "quran/juz", "quran/pages");
	await processJuzToHizb(dirname, "quran/juz", "quran/hizb");

	await fetchRecitersAndScrapeSurahAudio(
		dirname,
		"quran/audio/surahs"
	);

	for (let audio of ayahAudioLinks) {
		await scrapeAyatAudio(
			dirname,
			"quran/audio/ayahs",
			audio.name,
			audio.path
		);
	}

	console.info("[Ended Scraping Data]");
};

scrapeAllData(__dirname);

// TODO: Create juz data from surah data
// TODO: Edit page data to fit new data from surah data
// TODO: Edit hizb data as well
