import { Hono } from "hono";
import loadJSON from "../../functions/loadJson";

const surahRoutes = new Hono();

surahRoutes.get("/", async (c) => {
	try {
		const data = await loadJSON("/data/v1/surah.json", c);
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

export default surahRoutes;
