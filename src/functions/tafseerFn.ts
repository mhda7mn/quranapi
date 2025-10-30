export const parseIds = (
	idsQuery: string | undefined
): number[] | null => {
	if (!idsQuery) return [];

	const ids = idsQuery
		.split(",")
		.map((id) => parseInt(id.trim(), 10))
		.filter((id) => !isNaN(id));

	const hasInvalid = ids.some((id) => id < 1 || id > 7);
	if (hasInvalid) {
		return null;
	}

	return ids;
};

export const filterTafseers = (
	tafseers: any[],
	allowedIds: number[]
) => {
	if (allowedIds.length === 0) return tafseers;
	return tafseers.filter((t: any) => allowedIds.includes(t.id));
};
