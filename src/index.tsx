import { Hono } from "hono";
import surahRoutes from "./routes/v1/surah.routes";
import loadJSON from "./functions/loadJson";

const app = new Hono();

app.use("*", (c, next) => {
	c.header("Cache-Control", "public, max-age=86400");
	return next();
});

app.route("/api/v1/surahs", surahRoutes);

export default app;
