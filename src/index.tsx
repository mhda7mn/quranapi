import { Hono } from "hono";
import surahRoutes from "./routes/v1/surah.routes";

const app = new Hono();

app.route("/api/v1/surahs", surahRoutes);

app.get("/", (c) => {
	return c.json("hello");
});

export default app;
