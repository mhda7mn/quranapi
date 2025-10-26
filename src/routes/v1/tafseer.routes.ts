import { Hono } from "hono";
import loadJSON from "../../functions/loadJson";

const tafseerRoutes = new Hono();

tafseerRoutes.get("/:surahNumber", async (c) => {
	try {
		const surahNumber = Number(c.req.param("surahNumber"));
		const surahQuery = c.req.query("surahInfo") !== "false";

		if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
			return c.json(
				{ error: "Surah must be a number between 1 and 114" },
				400
			);
		}

		const surahTafseerData: any = await loadJSON(
			`/data/v1/tafseers/${surahNumber}.json`,
			c
		);

		const data =
			surahQuery === false
				? { ayat: surahTafseerData.ayat }
				: surahTafseerData;

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

tafseerRoutes.get("/:surahNumber/:ayahNumber", async (c) => {
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

		const surahTafseerData: any = await loadJSON(
			`/data/v1/tafseers/${surahNumber}.json`,
			c
		);

		const ayat = surahTafseerData.ayat;

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

		const ayahTafseer = ayat?.[ayahNumber];
		let data;
		surahQuery === false
			? (data = {
					ayat: {
						[ayahNumber]: ayahTafseer,
					},
			  })
			: (data = {
					surah: surahTafseerData.surah,
					ayat: {
						[ayahNumber]: ayahTafseer,
					},
			  });

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

export default tafseerRoutes;
