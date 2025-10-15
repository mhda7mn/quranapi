import path from "path";
import https from "https";
import fs from "node:fs";

// Artificially slowing down requests to not get slowed down by APIs
export const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const createJsonFile = async (
	dirname,
	folder,
	filename,
	data
) => {
	const dataDir = path.join(dirname, folder);
	const filePath = path.join(dataDir, filename);

	try {
		await fs.promises.mkdir(dataDir, { recursive: true });
		await fs.promises.writeFile(
			filePath,
			JSON.stringify(data, null, 2)
		);

		console.log(`[Created File] - ${filename}`);
	} catch (err) {
		console.error(`[Error Creating File] - ${err}`);
	}
};

export const addAyatData = async (
	dirname,
	folder,
	filename,
	ayahNo,
	data
) => {
	const dataDir = path.join(dirname, folder);
	const filePath = path.join(dataDir, filename);

	try {
		if (fs.existsSync(filePath)) {
			const existingDataFile = JSON.parse(
				await fs.promises.readFile(filePath, "utf-8")
			);
			existingDataFile.ayat.push(...data);
			await fs.promises.writeFile(
				filePath,
				JSON.stringify(existingDataFile, null, 2)
			);

			console.log(`[Added Ayah Data] - (${ayahNo}) - ${filename}`);
		}
	} catch (err) {
		console.error(`[Error Adding Ayah Data] - ${err}`);
	}
};

export const downloadFile = async (
	url,
	filename,
	retries = 5,
	delayTime = 1000
) => {
	try {
		const file = fs.createWriteStream(filename);

		// downloading file from api
		await new Promise((resolve, reject) => {
			https
				.get(url, (res) => {
					res.pipe(file);
					file.on("finish", () => {
						file.close();
						console.info(`[Downloaded File] - ${filename}`);
						resolve();
					});
				})
				.on("error", (err) => {
					fs.unlink(filename, () => {});
					reject(err);
				});
		});
	} catch (err) {
		console.error(`[Error Downloading File] - ${err}`);
		if (retries > 0) {
			console.info(`[Retrying Download] - ${retries} retries left`);
			await delay(delayTime);
			await downloadFile(url, filename, retries - 1, delayTime * 2);
		} else {
			console.error(
				`[Error Downloading File] - Max retries reached, Skipping file.`
			);
		}
	}
};
