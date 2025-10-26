const loadJSON = async (path: string, c: any) => {
	const baseUrl = c.env.BASE_URL || "";

	const fullUrl = `${baseUrl}${path}`;
	const res = await fetch(fullUrl);
	if (!res.ok) throw new Error("Not found");
	return res.json();
};

export default loadJSON;
