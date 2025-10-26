import { Context } from "hono";
import { env } from "hono/adapter";

const loadJSON = async (path: string, c: Context) => {
	const { BASE_URL } = env<{ BASE_URL: string }>(c);

	const fullUrl = `${BASE_URL}${path}`;
	const res = await fetch(fullUrl);
	if (!res.ok) throw new Error("Not found");
	return res.json();
};

export default loadJSON;
