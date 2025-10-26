import { Hono } from "hono";
import loadJSON from "../../functions/loadJson";

const hizbRoutes = new Hono();

hizbRoutes.get("/", async (c) => {
	try {
		const includeMeta = c.req.query("meta") !== "false";

		let data = (await loadJSON("/data/v1/hizb.json", c)) as Record<
			string,
			any[]
		>;

		if (includeMeta === false) {
			data = Object.fromEntries(
				Object.entries(data).map(([hizbNumber, ayahs]) => [
					hizbNumber,
					ayahs.map(({ meta, ...rest }) => rest),
				])
			);
		}

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

hizbRoutes.get("/:number", async (c) => {
	try {
		const number = Number(c.req.param("number"));
		const includeMeta = c.req.query("meta") !== "false";

		if (isNaN(number) || number < 1 || number > 60) {
			return c.json(
				{ error: "Hizb must be a number between 1 and 60" },
				400
			);
		}

		let data = (await loadJSON(
			`/data/v1/hizb/${number}.json`,
			c
		)) as any[];

		if (includeMeta === false) {
			data = data.map(({ meta, ...rest }) => rest);
		}

		return c.json(data, 200);
	} catch (err) {
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

export default hizbRoutes;
