import { Hono } from "hono";
import loadJSON from "../../functions/loadJson";

const surahRoutes = new Hono();

surahRoutes.get("/", async (c) => {
	try {
		const ayatQuery = c.req.query("ayat") !== "false";
		const surahData: any = await loadJSON("/data/v1/surah.json", c);

		const data = surahData.map((surah: any) => {
			if (ayatQuery === false) {
				const { ayat, ...surahWithoutAyat } = surah;
				return surahWithoutAyat;
			}
			return surah;
		});

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

surahRoutes.get("/:number", async (c) => {
	try {
		const number = Number(c.req.param("number"));
		const ayatQuery = c.req.query("ayat") !== "false";

		if (isNaN(number) || number < 1 || number > 114) {
			return c.json(
				{ error: "Surah must be a number between 1 and 114" },
				400
			);
		}

		let data: any = await loadJSON(
			`/data/v1/surahs/${number}.json`,
			c
		);

		if (ayatQuery === false) {
			const { ayat, ...rest } = data;
			data = rest;
		}

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

surahRoutes.get("/:surahNumber/:ayahNumber", async (c) => {
	try {
		const surahNumber = Number(c.req.param("surahNumber"));
		const ayahNumber = Number(c.req.param("ayahNumber"));

		const surahQuery = c.req.query("surahInfo") !== "false";

		if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
			return c.json(
				{ error: "Surah must be a number between 1 and 114" },
				400
			);
		}

		const surahData: any = await loadJSON(
			`/data/v1/surahs/${surahNumber}.json`,
			c
		);
		const { ayat, ...rest } = surahData;

		if (
			isNaN(ayahNumber) ||
			ayahNumber < 1 ||
			ayahNumber > ayat.length
		) {
			return c.json(
				{
					error: `Ayah must be a number between 1 and ${ayat.length}`,
				},
				400
			);
		}

		const ayah = ayat.find((a: any) => a.ayahNo === ayahNumber);
		let data;

		surahQuery === true
			? (data = { surah: rest, ayah })
			: (data = ayah);

		return c.json(data, 200);
	} catch (err) {
		console.log(err);
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

export default surahRoutes;
