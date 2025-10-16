import { Router } from "express";

const surahRoutes = Router();

surahRoutes.get("/", (req, res) => {
	res.status(200).json({ message: "Hello" });
});

export default surahRoutes;
