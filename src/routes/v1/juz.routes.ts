import { Hono } from "hono";
import loadJSON from "../../functions/loadJson";

const juzRoutes = new Hono();

juzRoutes.get("/", async (c) => {
	try {
		const includeMeta = c.req.query("meta") !== "false";

		let data = (await loadJSON("/data/v1/juz.json", c)) as Record<
			string,
			any[]
		>;

		if (!includeMeta) {
			data = Object.fromEntries(
				Object.entries(data).map(([juzNumber, ayahs]) => [
					juzNumber,
					ayahs.map(({ meta, ...rest }) => rest),
				])
			);
		}

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

juzRoutes.get("/:number", async (c) => {
	try {
		const number = Number(c.req.param("number"));
		const includeMeta = c.req.query("meta") !== "false";

		if (isNaN(number) || number < 1 || number > 30) {
			return c.json(
				{ error: "Juz must be a number between 1 and 30" },
				400
			);
		}

		let data = (await loadJSON(
			`/data/v1/juz/${number}.json`,
			c
		)) as any[];

		if (!includeMeta) {
			data = data.map(({ meta, ...rest }) => rest);
		}

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

export default juzRoutes;
