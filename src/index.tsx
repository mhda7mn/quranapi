import { Hono } from "hono";
import { cors } from "hono/cors";

import surahRoutes from "./routes/v1/surah.routes";
import ayahRoutes from "./routes/v1/ayah.routes";
import juzRoutes from "./routes/v1/juz.routes";
import hizbRoutes from "./routes/v1/hizb.routes";
import pageRoutes from "./routes/v1/pages.routes";
import tafseerRoutes from "./routes/v1/tafseer.routes";

const app = new Hono();

app.use("*", cors());
app.use("*", (c, next) => {
	c.header("X-Content-Type-Options", "nosniff");
	c.header("X-Frame-Options", "DENY");
	c.header("X-XSS-Protection", "1; mode=block");
	return next();
});
app.use("*", (c, next) => {
	c.header("Cache-Control", "public, max-age=86400");
	return next();
});
app.use("*", async (c, next) => {
	console.log(`${c.req.method} ${c.req.url}`);
	const res = await next();
	console.log(`Status: ${c.res.status}`);
	return res;
});

app.route("/api/v1/surahs", surahRoutes);
app.route("/api/v1/ayahs", ayahRoutes);
app.route("/api/v1/juz", juzRoutes);
app.route("/api/v1/hizb", hizbRoutes);
app.route("/api/v1/pages", pageRoutes);
app.route("/api/v1/tafseer", tafseerRoutes);

app.all("*", (c) => {
	return c.json({ message: "Route not found" }, 404);
});

export default app;
