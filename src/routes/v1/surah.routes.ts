import { Hono } from "hono";

const surahRoutes = new Hono();

surahRoutes.get("/", (c) => {
	return c.json("/surahs");
});

export default surahRoutes;
