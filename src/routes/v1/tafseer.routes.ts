import { Hono } from "hono";
import loadJSON from "../../functions/loadJson";
import { filterTafseers, parseIds } from "../../functions/tafseerFn";

const tafseerRoutes = new Hono();

tafseerRoutes.get("/:surahNumber", async (c) => {
	try {
		const surahNumber = Number(c.req.param("surahNumber"));
		const surahQuery = c.req.query("surahInfo") !== "false";
		const idsQuery = c.req.query("ids");
		const allowedIds = parseIds(idsQuery);

		if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
			return c.json(
				{ error: "Surah must be a number between 1 and 114" },
				400
			);
		}

		if (idsQuery !== undefined && allowedIds === null) {
			return c.json(
				{
					error:
						"Invalid 'ids'. Must be comma-separated numbers from 1 to 7.",
				},
				400
			);
		}

		const surahTafseerData: any = await loadJSON(
			`/data/v1/tafseer/${surahNumber}.json`,
			c
		);

		const filteredAyat = surahTafseerData.ayat.map((ayah: any) => ({
			ayahNo: ayah.ayahNo,
			tafseer: filterTafseers(ayah.tafseer, allowedIds || []),
		}));

		const data = surahQuery
			? { surah: surahTafseerData.surah, ayat: filteredAyat }
			: { ayat: filteredAyat };

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
		const idsQuery = c.req.query("ids");
		const allowedIds = parseIds(idsQuery);

		if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
			return c.json(
				{ error: "Surah must be a number between 1 and 114" },
				400
			);
		}

		if (idsQuery !== undefined && allowedIds === null) {
			return c.json(
				{
					error:
						"Invalid 'ids'. Must be comma-separated numbers from 1 to 7.",
				},
				400
			);
		}

		const surahTafseerData: any = await loadJSON(
			`/data/v1/tafseer/${surahNumber}.json`,
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

		const ayahTafseer = ayat[ayahNumber - 1];

		const filteredTafseer = filterTafseers(
			ayahTafseer.tafseer,
			allowedIds || []
		);

		const data = surahQuery
			? {
					surah: surahTafseerData.surah,
					ayat: {
						[ayahNumber]: {
							ayahNo: ayahNumber,
							tafseer: filteredTafseer,
						},
					},
			  }
			: {
					ayat: {
						[ayahNumber]: {
							ayahNo: ayahNumber,
							tafseer: filteredTafseer,
						},
					},
			  };

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

export default tafseerRoutes;
