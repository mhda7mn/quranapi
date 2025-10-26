import { Hono } from "hono";
import surahRoutes from "./routes/v1/surah.routes";
import ayahRoutes from "./routes/v1/ayah.routes";
import juzRoutes from "./routes/v1/juz.routes";
import hizbRoutes from "./routes/v1/hizb.routes";
import pageRoutes from "./routes/v1/pages.routes";
import tafseerRoutes from "./routes/v1/tafseer.routes";

const app = new Hono();

app.use("*", (c, next) => {
	c.header("Cache-Control", "public, max-age=86400");
	return next();
});

app.route("/api/v1/surahs", surahRoutes);
app.route("/api/v1/ayahs", ayahRoutes);
app.route("/api/v1/juz", juzRoutes);
app.route("/api/v1/hizb", hizbRoutes);
app.route("/api/v1/pages", pageRoutes);
app.route("/api/v1/tafseer", tafseerRoutes);

export default app;
