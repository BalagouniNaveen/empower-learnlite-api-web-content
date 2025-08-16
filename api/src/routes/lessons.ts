import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/", async (req, res) => {
  const { locale = "en", topic } = req.query as { locale?: string; topic?: string };
  const where: any = { locale };
  if (topic) where.topic = topic;
  const lessons = await prisma.lesson.findMany({ where, select: { id:true, slug:true, title:true, topic:true, estMins:true } });
  res.json(lessons);
});

r.get("/:slug", async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });
  if (!lesson) return res.status(404).json({ error: "Not found" });
  res.json(lesson);
});

export default r;
