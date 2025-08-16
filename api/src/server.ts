import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import lessons from "./routes/lessons.js";
import quiz from "./routes/quiz.js";
import progress from "./routes/progress.js";
import sms from "./routes/sms.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/lessons", lessons);
app.use("/api/quiz", quiz);
app.use("/api/progress", progress);
app.use("/webhooks/sms", sms);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
